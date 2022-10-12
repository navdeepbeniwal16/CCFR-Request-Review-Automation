import { Autocomplete, Box, Grid, Group, Space, Switch, TextInput } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { UseFormReturnType } from "@mantine/form";
import { useState } from "react";
import { Application } from "../../lib/interfaces";



export function Section1({ form }: { form: UseFormReturnType<Application> }) {
    const [checked, setChecked] = useState(false);
    return (
        <Box>
            <h2>Section 1: Investigator and General Information</h2>

            <Group position="center" grow>
                <TextInput
                    withAsterisk
                    label="Principal Investigator"
                    {...form.getInputProps('institutionPrimary.investigator')}
                />
                <TextInput
                    withAsterisk
                    label="Job Title"
                    {...form.getInputProps('institutionPrimary.jobTitle')}
                />
            </Group>

            <Group position="center" grow>
                <TextInput
                    withAsterisk
                    label="Institution"
                    {...form.getInputProps('institutionPrimary.institution')}
                />
                <TextInput
                    withAsterisk
                    label="Department"
                    {...form.getInputProps('institutionPrimary.department')}
                />
            </Group>

            <Group position="center" grow>
                <TextInput
                    withAsterisk
                    label="Email Address"
                    placeholder="your@email.com"
                    {...form.getInputProps('email')}
                />
                <TextInput
                    label="Phone Number"
                    {...form.getInputProps('phoneNumber')}
                />
            </Group>

            <TextInput
                withAsterisk
                label="Address"
                {...form.getInputProps('address.streetName')}
            />

            <Group position="center" grow>
                <TextInput
                    withAsterisk
                    label="City/Suburb"
                    {...form.getInputProps('address.city')}
                />
                <TextInput
                    withAsterisk
                    label="State"
                    {...form.getInputProps('address.state')}
                />
            </Group>

            <Group position="center" grow>
                <TextInput
                    withAsterisk
                    label="Zip/Post Code"
                    {...form.getInputProps('address.zipcode')}
                />
                <TextInput
                    withAsterisk
                    label="Country"
                    {...form.getInputProps('address.country')}
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
                        onChange={event =>
                            setChecked(event.currentTarget.checked)
                        }
                        onLabel="Yes"
                        offLabel="No"
                        size="xl"
                    />
                </Grid.Col>
            </Grid>

            <Space h="lg" />

            {checked && (
                // (scndIns.naem || scndInst.biospec)
                <>
                    <Autocomplete
                        label="If yes, access to what?"
                        placeholder="Pick one"
                        data={['Data', 'BioSpecimens', 'Both']}
                        {...form.getInputProps(
                            'institutionSecondary.accessType',
                        )}
                    />
                    <Group position="center" grow>
                        <TextInput
                            withAsterisk
                            label="Principal Investigator"
                            {...form.getInputProps(
                                'institutionSecondary.investigator',
                            )}
                        />
                        <TextInput
                            withAsterisk
                            label="Job Title"
                            {...form.getInputProps(
                                'institutionSecondary.jobTitle',
                            )}
                        />
                    </Group>

                    <Group position="center" grow>
                        <TextInput
                            withAsterisk
                            label="Institution"
                            {...form.getInputProps(
                                'institutionSecondary.institution',
                            )}
                        />
                        <TextInput
                            withAsterisk
                            label="Department"
                            {...form.getInputProps(
                                'institutionSecondary.department',
                            )}
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
                    />
                </Grid.Col>
            </Grid>

            <Space h="lg" />

            <Group grow>
                <DatePicker
                    placeholder="Pick date"
                    label="Deadline for receipt of data"
                    {...form.getInputProps('dateReceiptDeadline')}
                />

                <DatePicker
                    placeholder="Pick date"
                    label="Deadline for receipt of biospecimens"
                    {...form.getInputProps('biospecimenReceiptDeadline')}
                />
            </Group>
        </Box>
    );
}