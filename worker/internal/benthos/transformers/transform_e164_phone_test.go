package transformers

import (
	"fmt"
	"testing"

	"github.com/benthosdev/benthos/v4/public/bloblang"
	"github.com/stretchr/testify/assert"
)

var testE164Phone = "+13782983927"

func Test_TransformE164NumberPreserveLengthTrue(t *testing.T) {

	res, err := TransformE164Number(testE164Phone, true)

	assert.NoError(t, err)
	assert.Equal(t, ValidateE164(*res), ValidateE164(testE164Phone), "The expected value should be a valid e164 number.")
	assert.Equal(t, len(*res), len(testE164Phone), "Generated phone number must be the same length as the input phone number")
}

func Test_TransformE164NumberPreserveLengthFalse(t *testing.T) {

	res, err := TransformE164Number(testE164Phone, false)

	assert.NoError(t, err)
	assert.Equal(t, ValidateE164(*res), ValidateE164(testE164Phone), "The expected value should be a valid e164 number.")
	// + 1 to account for the plus sign at the beginning
	assert.Equal(t, len(*res), defaultE164Length+1, "Generated phone number must be the same length as the input phone number")
}

func Test_GenerateE164FormatPhoneNumberPreserveLength(t *testing.T) {

	res, err := GenerateE164FormatPhoneNumberPreserveLength(testE164Phone)

	assert.NoError(t, err)
	assert.Equal(t, ValidateE164(res), ValidateE164(testE164Phone), "The expected value should be a valid e164 number.")
	// + 1 to account for the plus sign at the beginning
	assert.Len(t, res, len(testE164Phone), "Generated phone number must be the same length as the input phone number")
}

func Test_TransformE164NumberTransformer(t *testing.T) {
	mapping := fmt.Sprintf(`root = transform_e164_phone(value:%q,preserve_length: true)`, testE164Phone)
	ex, err := bloblang.Parse(mapping)
	assert.NoError(t, err, "failed to parse the phone transformer")

	res, err := ex.Query(nil)
	assert.NoError(t, err)

	resStr, ok := res.(*string)
	if !ok {
		t.Errorf("Expected *string, got %T", res)
		return
	}

	if resStr != nil {
		assert.Equal(t, ValidateE164(*resStr), ValidateE164(testE164Phone), "The expected value should be a valid e164 number.")
		assert.Len(t, *resStr, len(testE164Phone), "Generated phone number must be the same length as the input phone number")
	} else {
		t.Error("Pointer is nil, expected a valid string pointer")
	}
}

func Test_TransformE164PhoneTransformerWithEmptyValue(t *testing.T) {

	nilE164Phone := ""
	mapping := fmt.Sprintf(`root = transform_e164_phone(value:%q,preserve_length: true)`, nilE164Phone)
	ex, err := bloblang.Parse(mapping)
	assert.NoError(t, err, "failed to parse the e164 phone transformer")

	_, err = ex.Query(nil)
	assert.NoError(t, err)
}
