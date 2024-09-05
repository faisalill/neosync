'use client';
import FormPersist from '@/app/(mgmt)/FormPersist';
import Spinner from '@/components/Spinner';
import OverviewContainer from '@/components/containers/OverviewContainer';
import PageHeader from '@/components/headers/PageHeader';
import SourceOptionsForm from '@/components/jobs/Form/SourceOptionsForm';
import { useAccount } from '@/components/providers/account-provider';
import { PageProps } from '@/components/types';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { cn, getSingleOrUndefined, splitConnections } from '@/libs/utils';
import { useMutation, useQuery } from '@connectrpc/connect-query';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  CheckConnectionConfigResponse,
  Connection,
  ConnectionConfig,
} from '@neosync/sdk';
import {
  checkConnectionConfigById,
  getConnections,
} from '@neosync/sdk/connectquery';
import {
  ArrowTopRightIcon,
  CheckCircledIcon,
  Cross2Icon,
  PlusIcon,
} from '@radix-ui/react-icons';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { usePostHog } from 'posthog-js/react';
import { ReactElement, useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { MdErrorOutline } from 'react-icons/md';
import { TiWarningOutline } from 'react-icons/ti';
import { useSessionStorage } from 'usehooks-ts';
import DestinationOptionsForm from '../../../../../../components/jobs/Form/DestinationOptionsForm';
import {
  getAllowedSyncDestinationTypes,
  getAllowedSyncSourceTypes,
  getConnectionType,
} from '../../../connections/util';
import {
  getDefaultUnmappedTransformConfig,
  getNewJobSessionKeys,
} from '../../../jobs/util';
import JobsProgressSteps, { getJobProgressSteps } from '../JobsProgressSteps';
import { ConnectFormValues } from '../job-form-validations';
import ConnectionSelectContent from './ConnectionSelectContent';

const NEW_CONNECTION_VALUE = 'new-connection';

interface DestinationValidationState {
  isValidating: boolean;
  response?: CheckConnectionConfigResponse;
}

export default function Page({ searchParams }: PageProps): ReactElement {
  const { account } = useAccount();
  const router = useRouter();
  useEffect(() => {
    if (!searchParams?.sessionId) {
      router.push(`/${account?.name}/new/job`);
    }
  }, [searchParams?.sessionId]);

  const sessionPrefix = getSingleOrUndefined(searchParams?.sessionId) ?? '';
  const sessionKeys = getNewJobSessionKeys(sessionPrefix);
  const sessionKey = sessionKeys.dataSync.connect;
  const [defaultValues] = useSessionStorage<ConnectFormValues>(sessionKey, {
    sourceId: '',
    sourceOptions: {},
    destinations: [{ connectionId: '', destinationOptions: {} }],
  });
  const [isSourceValidating, setIsSourceValidating] = useState<boolean>(false);

  const [sourceValidationResponse, setSourceValidationResponse] = useState<
    CheckConnectionConfigResponse | undefined
  >();

  const [destinationValidation, setDestinationValidation] = useState<
    Record<string, DestinationValidationState>
  >({});

  const { isLoading: isConnectionsLoading, data: connectionsData } = useQuery(
    getConnections,
    { accountId: account?.id },
    { enabled: !!account?.id }
  );
  const connections = connectionsData?.connections ?? [];

  const form = useForm<ConnectFormValues>({
    mode: 'onChange',
    resolver: yupResolver<ConnectFormValues>(ConnectFormValues),
    values: defaultValues,
    context: { connections },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'destinations',
  });

  const posthog = usePostHog();

  async function onSubmit(_values: ConnectFormValues) {
    posthog.capture('New Job Flow Connect Complete', { jobType: 'data-sync' });
    router.push(`/${account?.name}/new/job/schema?sessionId=${sessionPrefix}`);
  }

  const { postgres, mysql, s3, mongodb, gcpcs, dynamodb, mssql } =
    splitConnections(connections);

  const { mutateAsync: checkConnectionConfig } = useMutation(
    checkConnectionConfigById
  );

  return (
    <div
      id="newjobflowcontainer"
      className="px-12 md:px-24 lg:px-48 xl:px-64 flex flex-col gap-5"
    >
      <FormPersist formKey={sessionKey} form={form} />
      <OverviewContainer
        Header={
          <PageHeader
            header="Connect"
            progressSteps={
              <JobsProgressSteps
                steps={getJobProgressSteps('data-sync', false)}
                stepName={'connect'}
              />
            }
          />
        }
        containerClassName="connect-page"
      >
        <div />
      </OverviewContainer>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div
            className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4`}
          >
            <div>
              <div>
                <div className="space-y-0.5">
                  <h2 className="text-xl font-semibold tracking-tight">
                    Source
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    The location of the source data.
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-4 col-span-2">
              <FormField
                control={form.control}
                name="sourceId"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      {isConnectionsLoading ? (
                        <Skeleton className="w-full h-12 rounded-lg" />
                      ) : (
                        <div className="flex flex-row items-center gap-2">
                          <Select
                            name={field.name}
                            disabled={field.disabled}
                            onValueChange={async (value: string) => {
                              if (!value) {
                                return;
                              }
                              if (value === NEW_CONNECTION_VALUE) {
                                const destIds = new Set(
                                  form
                                    .getValues('destinations')
                                    .map((d) => d.connectionId)
                                );

                                const urlParams = new URLSearchParams({
                                  returnTo: `/${account?.name}/new/job/connect?sessionId=${sessionPrefix}&from=new-connection`,
                                });

                                const connTypes = new Set(
                                  connections
                                    .filter((c) => destIds.has(c.id))
                                    .map((c) =>
                                      getConnectionType(
                                        c.connectionConfig ??
                                          new ConnectionConfig()
                                      )
                                    )
                                    .filter((x) => !!x)
                                );
                                const allowedSourceTypes =
                                  getAllowedSyncSourceTypes(
                                    Array.from(connTypes)
                                  );
                                allowedSourceTypes.forEach((sourceType) =>
                                  urlParams.append('connectionType', sourceType)
                                );

                                router.push(
                                  `/${account?.name}/new/connection?${urlParams.toString()}`
                                );
                                return;
                              }
                              field.onChange(value);
                              const connection =
                                connections.find((c) => c.id === value) ??
                                new Connection();
                              const connectionType = getConnectionType(
                                connection.connectionConfig ??
                                  new ConnectionConfig()
                              );
                              setIsSourceValidating(true);
                              try {
                                const res = await checkConnectionConfig({
                                  id: form.getValues('sourceId'),
                                });
                                setSourceValidationResponse(res);
                              } catch (err) {
                                setSourceValidationResponse(
                                  new CheckConnectionConfigResponse({
                                    isConnected: false,
                                    connectionError:
                                      err instanceof Error
                                        ? err.message
                                        : 'unknown error',
                                  })
                                );
                              } finally {
                                setIsSourceValidating(false);
                              }

                              if (connectionType === 'pgConfig') {
                                form.setValue(
                                  'sourceOptions',
                                  {
                                    postgres: {
                                      haltOnNewColumnAddition: false,
                                    },
                                  },
                                  {
                                    shouldDirty: true,
                                    shouldTouch: true,
                                    shouldValidate: true,
                                  }
                                );
                              } else if (connectionType === 'mysqlConfig') {
                                form.setValue(
                                  'sourceOptions',
                                  {
                                    mysql: {
                                      haltOnNewColumnAddition: false,
                                    },
                                  },
                                  {
                                    shouldDirty: true,
                                    shouldTouch: true,
                                    shouldValidate: true,
                                  }
                                );
                              } else if (connectionType === 'dynamodbConfig') {
                                form.setValue(
                                  'sourceOptions',
                                  {
                                    dynamodb: {
                                      unmappedTransformConfig:
                                        getDefaultUnmappedTransformConfig(),
                                      enableConsistentRead: false,
                                    },
                                  },
                                  {
                                    shouldDirty: true,
                                    shouldTouch: true,
                                    shouldValidate: true,
                                  }
                                );
                              } else if (connectionType === 'mssqlConfig') {
                                form.setValue(
                                  'sourceOptions',
                                  {
                                    mssql: {
                                      haltOnNewColumnAddition: false,
                                    },
                                  },
                                  {
                                    shouldDirty: true,
                                    shouldTouch: true,
                                    shouldValidate: true,
                                  }
                                );
                              } else {
                                form.setValue(
                                  'sourceOptions',
                                  {},
                                  {
                                    shouldDirty: true,
                                    shouldTouch: true,
                                    shouldValidate: true,
                                  }
                                );
                              }
                            }}
                            value={field.value}
                          >
                            <SelectTrigger
                              className={cn(
                                field.value
                                  ? undefined
                                  : 'text-muted-foreground'
                              )}
                            >
                              <SelectValue
                                ref={field.ref}
                                placeholder="Select a source ..."
                              />
                            </SelectTrigger>
                            <SelectContent>
                              <ConnectionSelectContent
                                postgres={postgres}
                                mysql={mysql}
                                mongodb={mongodb}
                                dynamodb={dynamodb}
                                mssql={mssql}
                                newConnectionValue={NEW_CONNECTION_VALUE}
                              />
                            </SelectContent>
                          </Select>
                          <div className="relative pb-4">
                            {form.getValues('sourceId') &&
                              isSourceValidating && (
                                <Spinner className="text-black dark:text-white absolute" />
                              )}
                          </div>
                        </div>
                      )}
                    </FormControl>
                    <div className="flex">
                      {form.getValues('sourceId') && !isSourceValidating && (
                        <TestConnectionBadge
                          validationResponse={sourceValidationResponse}
                          id={form.getValues('sourceId')}
                          accountName={account?.name ?? ''}
                        />
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sourceOptions"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <SourceOptionsForm
                        connection={connections.find(
                          (c) => c.id === form.getValues().sourceId
                        )}
                        value={field.value}
                        setValue={(newOpts) => field.onChange(newOpts)}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>
          <Separator className="my-6" />
          <div
            className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4`}
          >
            <div className="space-y-0.5">
              <h2 className="text-xl font-semibold tracking-tight">
                Destination(s)
              </h2>
              <p className="text-muted-foreground text-sm">
                Where the data should be synced.
              </p>
            </div>
            <div className="space-y-12 col-span-2">
              {fields.map((val, index) => {
                return (
                  <div className="space-y-4 col-span-2" key={val.id}>
                    <div className="flex flex-row gap-2">
                      <div className="basis-11/12">
                        <FormField
                          control={form.control}
                          name={`destinations.${index}.connectionId`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                {isConnectionsLoading ? (
                                  <Skeleton className="w-full h-12 rounded-lg" />
                                ) : (
                                  <div className="flex flex-row items-center gap-2">
                                    <Select
                                      name={field.name}
                                      disabled={field.disabled}
                                      onValueChange={async (value: string) => {
                                        if (!value) {
                                          return;
                                        }
                                        const sourceId =
                                          form.getValues('sourceId');
                                        const connection = connections.find(
                                          (c) => c.id === sourceId
                                        );

                                        if (value === NEW_CONNECTION_VALUE) {
                                          const urlParams = new URLSearchParams(
                                            {
                                              returnTo: `/${account?.name}/new/job/connect?sessionId=${sessionPrefix}&from=new-connection`,
                                            }
                                          );

                                          const allowedDestinationConnectionTypes =
                                            getAllowedSyncDestinationTypes(
                                              connection?.connectionConfig
                                                ?.config.case
                                            );
                                          allowedDestinationConnectionTypes.forEach(
                                            (ct) =>
                                              urlParams.append(
                                                'connectionType',
                                                ct
                                              )
                                          );

                                          router.push(
                                            `/${account?.name}/new/connection?${urlParams.toString()}`
                                          );
                                          return;
                                        }
                                        // set values
                                        field.onChange(value);
                                        const destConnection = connections.find(
                                          (c) => c.id === value
                                        );
                                        const destConnType = getConnectionType(
                                          destConnection?.connectionConfig ??
                                            new ConnectionConfig()
                                        );

                                        setDestinationValidation(
                                          (prevState) => ({
                                            ...prevState,
                                            [value]: {
                                              isValidating: true,
                                              response:
                                                new CheckConnectionConfigResponse(
                                                  {}
                                                ),
                                            },
                                          })
                                        );
                                        try {
                                          const res =
                                            await checkConnectionConfig({
                                              id: value,
                                            });
                                          setDestinationValidation(
                                            (prevState) => ({
                                              ...prevState,
                                              [value]: {
                                                isValidating: false,
                                                response: res,
                                              },
                                            })
                                          );
                                        } catch (err) {
                                          setDestinationValidation(
                                            (prevState) => ({
                                              ...prevState,
                                              [value]: {
                                                isValidating: false,
                                                response:
                                                  new CheckConnectionConfigResponse(
                                                    {
                                                      isConnected: false,
                                                      connectionError:
                                                        err instanceof Error
                                                          ? err.message
                                                          : 'unknown error',
                                                    }
                                                  ),
                                              },
                                            })
                                          );
                                        } finally {
                                          setIsSourceValidating(false);
                                        }

                                        if (destConnType === 'pgConfig') {
                                          form.setValue(
                                            `destinations.${index}.destinationOptions`,
                                            {
                                              postgres: {
                                                truncateBeforeInsert: false,
                                                truncateCascade: false,
                                                initTableSchema: false,
                                                onConflictDoNothing: false,
                                              },
                                            },
                                            {
                                              shouldDirty: true,
                                              shouldTouch: true,
                                              shouldValidate: true,
                                            }
                                          );
                                        } else if (
                                          destConnType === 'mysqlConfig'
                                        ) {
                                          form.setValue(
                                            `destinations.${index}.destinationOptions`,
                                            {
                                              mysql: {
                                                truncateBeforeInsert: false,
                                                initTableSchema: false,
                                                onConflictDoNothing: false,
                                              },
                                            },
                                            {
                                              shouldDirty: true,
                                              shouldTouch: true,
                                              shouldValidate: true,
                                            }
                                          );
                                        } else if (
                                          destConnType === 'dynamodbConfig'
                                        ) {
                                          form.setValue(
                                            `destinations.${index}.destinationOptions`,
                                            {
                                              dynamodb: {
                                                tableMappings: [],
                                              },
                                            },
                                            {
                                              shouldDirty: true,
                                              shouldTouch: true,
                                              shouldValidate: true,
                                            }
                                          );
                                        } else if (
                                          destConnType === 'mssqlConfig'
                                        ) {
                                          form.setValue(
                                            `destinations.${index}.destinationOptions`,
                                            {
                                              mssql: {
                                                truncateBeforeInsert: false,
                                                initTableSchema: false,
                                                onConflictDoNothing: false,
                                              },
                                            },
                                            {
                                              shouldDirty: true,
                                              shouldTouch: true,
                                              shouldValidate: true,
                                            }
                                          );
                                        }
                                      }}
                                      value={field.value}
                                    >
                                      <SelectTrigger
                                        className={cn(
                                          field.value
                                            ? undefined
                                            : 'text-muted-foreground'
                                        )}
                                      >
                                        <SelectValue
                                          ref={field.ref}
                                          placeholder="Select a destination ..."
                                        />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <ConnectionSelectContent
                                          postgres={postgres}
                                          mysql={mysql}
                                          s3={s3}
                                          mongodb={mongodb}
                                          gcpcs={gcpcs}
                                          dynamodb={dynamodb}
                                          mssql={mssql}
                                          newConnectionValue={
                                            NEW_CONNECTION_VALUE
                                          }
                                        />
                                      </SelectContent>
                                    </Select>
                                    <div className="relative pb-4">
                                      {form.getValues(
                                        `destinations.${index}.connectionId`
                                      ) &&
                                        destinationValidation[
                                          form.getValues(
                                            `destinations.${index}.connectionId`
                                          )
                                        ]?.isValidating && (
                                          <Spinner className="text-black dark:text-white absolute" />
                                        )}
                                    </div>
                                  </div>
                                )}
                              </FormControl>
                              <div className="inline-flex">
                                <TestConnectionBadge
                                  validationResponse={
                                    destinationValidation[
                                      form.getValues(
                                        `destinations.${index}.connectionId`
                                      )
                                    ]?.response
                                  }
                                  id={form.getValues(
                                    `destinations.${index}.connectionId`
                                  )}
                                  accountName={account?.name ?? ''}
                                />
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <Button
                        type="button"
                        variant="outline"
                        disabled={fields.length === 1}
                        onClick={() => {
                          if (fields.length != 1) {
                            remove(index);
                          }
                        }}
                      >
                        <Cross2Icon className="w-4 h-4" />
                      </Button>
                    </div>
                    <FormField
                      control={form.control}
                      name={`destinations.${index}.destinationOptions`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <DestinationOptionsForm
                              connection={connections.find(
                                (c) =>
                                  c.id ==
                                  form.getValues().destinations[index]
                                    .connectionId
                              )}
                              value={field.value}
                              setValue={(newOpts) => {
                                field.onChange(newOpts);
                              }}
                              hideDynamoDbTableMappings={true}
                              destinationDetailsRecord={{}} // not used beacause we are hiding dynamodb table mappings
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                );
              })}

              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  append({
                    connectionId: '',
                    destinationOptions: {},
                  });
                }}
              >
                Add
                <PlusIcon className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="flex flex-row gap-1 justify-between">
            <Button
              type="button"
              onClick={() => {
                if (searchParams?.from === 'new-connection') {
                  router.push(
                    `/${account?.name}/new/job/define?sessionId=${sessionPrefix}`
                  );
                  return;
                }
                router.back();
              }}
            >
              Back
            </Button>
            <Button type="submit" disabled={!form.formState.isValid}>
              Next
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

interface TestConnectionBadgeProps {
  validationResponse: CheckConnectionConfigResponse | undefined;
  id: string | undefined;
  accountName: string;
}

function TestConnectionBadge(props: TestConnectionBadgeProps) {
  const { validationResponse, id, accountName } = props;

  return (
    <ValidationResponseBadge
      validationResponse={validationResponse}
      accountName={accountName}
      id={id ?? ''}
    />
  );
}

interface ValidationResponseBadgeProps {
  validationResponse: CheckConnectionConfigResponse | undefined;
  accountName: string;
  id: string;
}

function ValidationResponseBadge(props: ValidationResponseBadgeProps) {
  const { validationResponse, accountName, id } = props;
  const url = `/${accountName}/connections/${id}/permissions`;

  if (
    validationResponse?.isConnected &&
    validationResponse.privileges.length > 0
  ) {
    return (
      <div className="flex flex-row items-center gap-2 rounded-xl px-2 py-1 h-auto text-green-900 dark:text-green-100 border border-green-700 bg-green-100 dark:bg-green-900 transition-colors">
        <CheckCircledIcon />
        <div className="text-nowrap text-xs font-semibold">
          Successfully connected
        </div>
      </div>
    );
  } else if (
    validationResponse?.isConnected &&
    validationResponse.privileges.length === 0
  ) {
    return (
      <Link href={url} passHref target="_blank">
        <div className="flex flex-row items-center gap-2 rounded-xl px-2 py-1 h-auto text-orange-900 dark:text-orange-100 border border-orange-700 bg-orange-100 dark:bg-orange-900 hover:bg-orange-200 hover:dark:bg-orange-950/90 transition-colors">
          <TiWarningOutline />
          <div className="text-nowrap text-xs font-semibold">
            Connection Warning - No tables found.{' '}
            <a
              href={url}
              className="underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              More info
            </a>
          </div>
          <ArrowTopRightIcon />
        </div>
      </Link>
    );
  } else if (validationResponse && !validationResponse.isConnected) {
    return (
      <Link href={url} passHref target="_blank">
        <div className="flex flex-row items-center gap-2 rounded-xl px-2 py-1 h-auto text-red-900 dark:text-red-100 border border-red-700 bg-red-100 dark:bg-red-950 hover:dark:bg-red-950/90 hover:bg-red-200 transition-colors">
          <MdErrorOutline />
          <div className="text-nowrap text-xs pl-2">
            Connection Error - Unable to connect.{' '}
            <a
              href={url}
              className="underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              More info
            </a>
          </div>
          <ArrowTopRightIcon />
        </div>
      </Link>
    );
  } else {
    return null;
  }
}
