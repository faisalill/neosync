import { TransformerConfigSchema } from '@/yup-validations/transformer-validations';
import { JobMappingTransformer, TransformerConfig } from '@neosync/sdk';
import * as Yup from 'yup';

// Yup schema form JobMappingTransformers
export const JobMappingTransformerForm = Yup.object({
  source: Yup.number().required('A valid transformer source must be specified'),
  config: TransformerConfigSchema,
});

// Simplified version of a job mapping transformer for use with react-hook-form only
export type JobMappingTransformerForm = Yup.InferType<
  typeof JobMappingTransformerForm
>;

export function convertJobMappingTransformerToForm(
  jmt: JobMappingTransformer
): JobMappingTransformerForm {
  return {
    source: jmt.source,
    config: convertTransformerConfigToForm(jmt.config),
  };
}
export function convertJobMappingTransformerFormToJobMappingTransformer(
  form: JobMappingTransformerForm
): JobMappingTransformer {
  return new JobMappingTransformer({
    source: form.source,
    config: convertTransformerConfigSchemaToTransformerConfig(form.config),
  });
}

export function convertTransformerConfigToForm(
  tc?: TransformerConfig
): TransformerConfigSchema {
  const config = tc?.config ?? { case: '', value: {} };
  if (!config.case) {
    return { case: '', value: {} };
  }
  return {
    case: config.case,
    value: config.value.toJson(),
  };
}

export function convertTransformerConfigSchemaToTransformerConfig(
  tcs: TransformerConfigSchema
): TransformerConfig {
  // hack job that fixes bigint json transformation until we can fit this with better types
  const value = tcs.value ?? {};
  Object.entries(tcs.value).forEach(([key, val]) => {
    value[key] = val;
    if (typeof val === 'bigint') {
      value[key] = val.toString();
    }
  });
  if (tcs instanceof TransformerConfig) {
    return tcs;
  } else {
    if (tcs.case) {
      return TransformerConfig.fromJson({ [tcs.case]: tcs.value });
    }
    return new TransformerConfig();
  }
}

export const JobMappingFormValues = Yup.object({
  schema: Yup.string().required('A schema is required'),
  table: Yup.string().required('A table is required'),
  column: Yup.string().required('A column is required'),
  transformer: JobMappingTransformerForm,
}).required('Job mapping values are required.');
export type JobMappingFormValues = Yup.InferType<typeof JobMappingFormValues>;

const VIRTUAL_FOREIGN_KEY_SCHEMA = Yup.object({
  schema: Yup.string().required('A schema is required'),
  table: Yup.string().required('A table is required'),
  columns: Yup.array().of(Yup.string().required('Columns are required')),
}).required('Virtural Foreign Key mappings are required.');

const VirtualForeignConstraintFormValues = Yup.object({
  schema: Yup.string().required('A schema is required'),
  table: Yup.string().required('A table is required'),
  columns: Yup.array().of(Yup.string().required('A column is required')),
  foreignKey: VIRTUAL_FOREIGN_KEY_SCHEMA,
}).required('Virtual Foreign Key Constraint values are required.');
export type VirtualForeignConstraintFormValues = Yup.InferType<
  typeof VirtualForeignConstraintFormValues
>;

const PostgresSourceOptionsFormValues = Yup.object({
  haltOnNewColumnAddition: Yup.boolean().optional().default(false),
});
const MysqlSourceOptionsFormValues = Yup.object({
  haltOnNewColumnAddition: Yup.boolean().optional().default(false),
});
const MssqlSourceOptionsFormValues = Yup.object({
  haltOnNewColumnAddition: Yup.boolean().optional().default(false),
});

const DynamoDBSourceUnmappedTransformConfigFormValues = Yup.object({
  byte: JobMappingTransformerForm.required(
    'A default transformer config must be provided for the byte data type'
  ),
  boolean: JobMappingTransformerForm.required(
    'A default transformer config must be provided for the boolean data type'
  ),
  n: JobMappingTransformerForm.required(
    'A default transformer config must be provided for the number data type'
  ),
  s: JobMappingTransformerForm.required(
    'A default transformer config must be provided for the string data type'
  ),
});
export type DynamoDBSourceUnmappedTransformConfigFormValues = Yup.InferType<
  typeof DynamoDBSourceUnmappedTransformConfigFormValues
>;

const DynamoDBSourceOptionsFormValues = Yup.object({
  unmappedTransformConfig:
    DynamoDBSourceUnmappedTransformConfigFormValues.required(
      'Must provide a DynamoDB unmapped transform config'
    ),
  enableConsistentRead: Yup.bool().default(false),
});
export type DynamoDBSourceOptionsFormValues = Yup.InferType<
  typeof DynamoDBSourceOptionsFormValues
>;

export const SourceOptionsFormValues = Yup.object({
  postgres: PostgresSourceOptionsFormValues.optional(),
  mysql: MysqlSourceOptionsFormValues.optional(),
  dynamodb: DynamoDBSourceOptionsFormValues.optional(),
  mssql: MssqlSourceOptionsFormValues.optional(),
});

export type SourceOptionsFormValues = Yup.InferType<
  typeof SourceOptionsFormValues
>;

export const SourceFormValues = Yup.object({
  sourceId: Yup.string().required('Source is required').uuid(),
  // strict().noUnknown() seems to fix an issue with the discriminating types sometimes being seen as present, which results in bad validation.
  sourceOptions: SourceOptionsFormValues.strict()
    .noUnknown()
    .required('Source Options is required'),
});

const DynamoDbDestinationOptionsFormValues = Yup.object({
  tableMappings: Yup.array()
    .of(
      Yup.object({
        sourceTable: Yup.string().required('Source table is required'),
        destinationTable: Yup.string().required(
          'Destination table is required'
        ),
      }).required('The Destinatino form values are required.')
    )
    .required('The Destination form values are required.')
    .default([]),
});
type DynamoDbDestinationOptionsFormValues = Yup.InferType<
  typeof DynamoDbDestinationOptionsFormValues
>;

const PostgresDbDestinationOptionsFormValues = Yup.object({
  truncateBeforeInsert: Yup.boolean().optional().default(false),
  truncateCascade: Yup.boolean().optional().default(false),
  initTableSchema: Yup.boolean().optional().default(false),
  onConflictDoNothing: Yup.boolean().optional().default(false),
  skipForeignKeyViolations: Yup.boolean().optional().default(false),
});

const MysqlDbDestinationOptionsFormValues = Yup.object({
  truncateBeforeInsert: Yup.boolean().optional().default(false),
  initTableSchema: Yup.boolean().optional().default(false),
  onConflictDoNothing: Yup.boolean().optional().default(false),
  skipForeignKeyViolations: Yup.boolean().optional().default(false),
});

const MssqlDbDestinationOptionsFormValues = Yup.object({
  truncateBeforeInsert: Yup.boolean().optional().default(false),
  initTableSchema: Yup.boolean().optional().default(false),
  onConflictDoNothing: Yup.boolean().optional().default(false),
  skipForeignKeyViolations: Yup.boolean().optional().default(false),
});

export const DestinationOptionsFormValues = Yup.object({
  postgres: PostgresDbDestinationOptionsFormValues.optional(),
  mysql: MysqlDbDestinationOptionsFormValues.optional(),
  dynamodb: DynamoDbDestinationOptionsFormValues.optional(),
  mssql: MssqlDbDestinationOptionsFormValues.optional(),
}).required('Destination Options are required.');
// Object that holds connection specific destination options for a job
export type DestinationOptionsFormValues = Yup.InferType<
  typeof DestinationOptionsFormValues
>;

const SchemaFormValuesDestinationOptions = Yup.object({
  destinationId: Yup.string().required('Destination Connection is required.'), // in this case it is the connection id
  dynamodb: DynamoDbDestinationOptionsFormValues.optional(),
});
export type SchemaFormValuesDestinationOptions = Yup.InferType<
  typeof SchemaFormValuesDestinationOptions
>;

export const SchemaFormValues = Yup.object({
  mappings: Yup.array()
    .of(JobMappingFormValues)
    .required('Schema mappings are required.'),
  virtualForeignKeys: Yup.array().of(VirtualForeignConstraintFormValues),
  connectionId: Yup.string().required('Connection is required.'),

  destinationOptions: Yup.array()
    .of(
      SchemaFormValuesDestinationOptions.required(
        'Schems Form Destination options are required'
      )
    )
    .required('Destination options are required'),
});
export type SchemaFormValues = Yup.InferType<typeof SchemaFormValues>;

export const NewDestinationFormValues = Yup.object({
  connectionId: Yup.string()
    .required('Connection is required')
    .uuid()
    .test(
      'checkConnectionUnique',
      'Destination must be different from source.',
      (value, ctx) => {
        if (ctx.from) {
          const { sourceId } = ctx.from[ctx.from.length - 1].value;
          if (value === sourceId) {
            return false;
          }
        }

        return true;
      }
    ),
  destinationOptions: DestinationOptionsFormValues,
}).required('Destination form values are required.');
export type NewDestinationFormValues = Yup.InferType<
  typeof NewDestinationFormValues
>;

const EditDestinationOptionsFormValues = Yup.object({
  destinationId: Yup.string().required('Destination is required'),
})
  .concat(
    DestinationOptionsFormValues.required(
      'Destination option form values are required.'
    )
  )
  .required('Destination and destination option form values are required.');
export type EditDestinationOptionsFormValues = Yup.InferType<
  typeof EditDestinationOptionsFormValues
>;

export const DataSyncSourceFormValues = SourceFormValues.concat(
  SchemaFormValues
).concat(
  Yup.object({
    destinationOptions: Yup.array()
      .of(
        EditDestinationOptionsFormValues.required(
          'Destination option form values are required.'
        )
      )
      .required('Destination options are required'),
  })
);
export type DataSyncSourceFormValues = Yup.InferType<
  typeof DataSyncSourceFormValues
>;
