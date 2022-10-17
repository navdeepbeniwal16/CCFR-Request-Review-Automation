import {
    Box,
    Grid,
    Group,
    NativeSelect,
    Space,
    Switch,
    TextInput,
} from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { UseFormReturnType } from '@mantine/form';
import { useState } from 'react';
import { Application } from '../../lib/interfaces';

export function Section1({
    form,
    readOnly,
}: {
    form: UseFormReturnType<Application>;
    readOnly?: boolean;
}) {
    const [checked, setChecked] = useState(
        'institutionSecondary' in form.values,
    );
    return (
        <Box>
            <h2>Section 1: Investigator and General Information</h2>

            <Group position="center" grow>
                <TextInput
                    required
                    withAsterisk={!readOnly}
                    label="Principal Investigator"
                    {...form.getInputProps('institutionPrimary.investigator')}
                    readOnly={readOnly}
                />
                <TextInput
                    required
                    withAsterisk={!readOnly}
                    label="Job Title"
                    {...form.getInputProps('institutionPrimary.jobTitle')}
                    readOnly={readOnly}
                />
            </Group>

            <Group position="center" grow>
                <TextInput
                    required
                    withAsterisk={!readOnly}
                    label="Institution"
                    {...form.getInputProps('institutionPrimary.institution')}
                    readOnly={readOnly}
                />
                <TextInput
                    required
                    withAsterisk={!readOnly}
                    label="Department"
                    {...form.getInputProps('institutionPrimary.department')}
                    readOnly={readOnly}
                />
            </Group>

            <Group position="center" grow>
                <TextInput
                    required
                    withAsterisk={!readOnly}
                    label="Email Address"
                    placeholder="your@email.com"
                    {...form.getInputProps('email')}
                    value={form.values.email}
                    readOnly
                />
                <TextInput
                    required
                    withAsterisk={!readOnly}
                    type="number"
                    label="Phone Number"
                    {...form.getInputProps('phoneNumber')}
                    readOnly={readOnly}
                    value={form.values.phoneNumber || ''}
                />
            </Group>

            <TextInput
                required
                withAsterisk={!readOnly}
                label="Address"
                {...form.getInputProps('address.streetName')}
                readOnly={readOnly}
            />

            <Group position="center" grow>
                <TextInput
                    required
                    withAsterisk={!readOnly}
                    label="City/Suburb"
                    {...form.getInputProps('address.city')}
                    readOnly={readOnly}
                />
                <TextInput
                    required
                    withAsterisk={!readOnly}
                    label="State"
                    {...form.getInputProps('address.state')}
                    readOnly={readOnly}
                />
            </Group>

            <Group position="center" grow>
                <TextInput
                    required
                    withAsterisk={!readOnly}
                    label="Zip/Post Code"
                    {...form.getInputProps('address.zipcode')}
                    readOnly={readOnly}
                />
                <TextInput
                    required
                    withAsterisk={!readOnly}
                    label="Country"
                    {...form.getInputProps('address.country')}
                    readOnly={readOnly}
                />
            </Group>
            <Space h="lg" />

            <Grid>
                <Grid.Col span={8}>
                    Will a 2nd institution require access to CCFR
                    data/biospecimens be involved in your study?
                </Grid.Col>
                <Grid.Col span={2}>
                    <Switch
                        checked={checked}
                        onChange={event => {
                            setChecked(event.currentTarget.checked);
                            form.setFieldValue(
                                'institutionSecondary',
                                event.currentTarget.checked
                                    ? {
                                          investigator: '',
                                          jobTitle: '',
                                          institution: '',
                                          department: '',
                                      }
                                    : undefined,
                            );
                        }}
                        onLabel="Yes"
                        offLabel="No"
                        size="xl"
                        disabled={readOnly}
                    />
                </Grid.Col>
            </Grid>

            <Space h="lg" />

            {checked && (
                <>
                    {readOnly ? (
                        <TextInput
                            value={form.values.institutionSecondary?.accessType}
                            label="If yes, access to what?"
                            placeholder="Pick one"
                            readOnly
                        />
                    ) : (
                        <NativeSelect
                            required
                            label="If yes, access to what?"
                            placeholder="Pick one"
                            data={['Data', 'BioSpecimens', 'Both']}
                            {...form.getInputProps(
                                'institutionSecondary.accessType',
                            )}
                            disabled={readOnly}
                        />
                    )}
                    <Group position="center" grow>
                        <TextInput
                            required
                            withAsterisk={!readOnly}
                            label="Principal Investigator"
                            {...form.getInputProps(
                                'institutionSecondary.investigator',
                            )}
                            readOnly={readOnly}
                        />
                        <TextInput
                            required
                            withAsterisk={!readOnly}
                            label="Job Title"
                            {...form.getInputProps(
                                'institutionSecondary.jobTitle',
                            )}
                            readOnly={readOnly}
                        />
                    </Group>

                    <Group position="center" grow>
                        <TextInput
                            required
                            withAsterisk={!readOnly}
                            label="Institution"
                            {...form.getInputProps(
                                'institutionSecondary.institution',
                            )}
                            readOnly={readOnly}
                        />
                        <TextInput
                            required
                            withAsterisk={!readOnly}
                            label="Department"
                            {...form.getInputProps(
                                'institutionSecondary.department',
                            )}
                            readOnly={readOnly}
                        />
                    </Group>
                </>
            )}

            <Space h="lg" />

            <Grid>
                <Grid.Col span={8}>
                    If requesting CCFR biospecimens, will they be used for
                    product commercialization?
                </Grid.Col>
                <Grid.Col span={2}>
                    <Switch
                        onLabel="Yes"
                        offLabel="No"
                        size="xl"
                        {...form.getInputProps('productCommercialization')}
                        disabled={readOnly}
                    />
                </Grid.Col>
            </Grid>

            <Space h="lg" />
            {readOnly ? (
                <Group grow>
                    <TextInput
                        value={form.values.dataReceiptDeadline
                            ?.toLocaleString('en-GB')
                            .slice(0, 10)}
                        placeholder="Pick date"
                        label="Deadline for receipt of data"
                        readOnly={true}
                    />

                    <TextInput
                        value={form.values.biospecimenReceiptDeadline
                            ?.toLocaleString('en-GB')
                            .slice(0, 10)}
                        placeholder="Pick date"
                        label="Deadline for receipt of biospecimens"
                        readOnly={true}
                    />
                </Group>
            ) : (
                <Group grow>
                    <DatePicker
                        placeholder="Pick date"
                        label="Deadline for receipt of data"
                        {...form.getInputProps('dataReceiptDeadline')}
                        value={
                            form.values.dataReceiptDeadline
                                ? new Date(form.values.dataReceiptDeadline)
                                : undefined
                        }
                    />

                    <DatePicker
                        placeholder="Pick date"
                        label="Deadline for receipt of biospecimens"
                        {...form.getInputProps('biospecimenReceiptDeadline')}
                        value={
                            form.values.biospecimenReceiptDeadline
                                ? new Date(
                                      form.values.biospecimenReceiptDeadline,
                                  )
                                : undefined
                        }
                    />
                </Group>
            )}
        </Box>
    );
}
