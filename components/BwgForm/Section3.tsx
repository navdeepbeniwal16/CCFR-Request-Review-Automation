import { Box, Group, Radio, Stack, Text, TextInput } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import { Application } from '../../lib/interfaces';

export function Section3({
    form,
    readOnly,
}: {
    form: UseFormReturnType<Application>;
    readOnly?: boolean;
}) {
    return (
        <Box>
            <Stack spacing="md">
                <h2>{'Section 3: Clarifications'}</h2>
                <Radio.Group
                    withAsterisk={!readOnly}
                    required
                    spacing="xl"
                    label="Does applicant anticipate >1 dispatch, e.g., a 2nd dispatch to validate initial findings?"
                    {...form.getInputProps(
                        'biospecimenForm.clarifications.additionalDispatchRequirement',
                    )}
                >
                    <Radio
                        required
                        value="Yes"
                        label="Yes"
                        disabled={readOnly}
                    />
                    <Radio value="No" label="No" disabled={readOnly} />
                    <Radio value="TBD" label="TBD" disabled={readOnly} />
                </Radio.Group>

                <Radio.Group
                    withAsterisk={!readOnly}
                    required
                    spacing="xl"
                    label="If requesting DNA, will fluorescent dye quantification be required?"
                    {...form.getInputProps(
                        'biospecimenForm.clarifications.fluoroscentDyeQuantificationRequired',
                    )}
                >
                    <Radio
                        required
                        value="Yes"
                        label="Yes"
                        disabled={readOnly}
                    />
                    <Radio value="No" label="No" disabled={readOnly} />
                    <Radio value="TBD" label="TBD" disabled={readOnly} />
                </Radio.Group>

                <Radio.Group
                    withAsterisk={!readOnly}
                    required
                    spacing="xl"
                    label="If blood-derived DNA is not available, will LCL-derived DNA be acceptable?"
                    {...form.getInputProps(
                        'biospecimenForm.clarifications.LCLDerivedDNAAcceptable',
                    )}
                >
                    <Radio
                        required
                        value="Yes"
                        label="Yes"
                        disabled={readOnly}
                    />
                    <Radio value="No" label="No" disabled={readOnly} />
                    <Radio value="TBD" label="TBD" disabled={readOnly} />
                </Radio.Group>

                <Radio.Group
                    withAsterisk={!readOnly}
                    required
                    spacing="xl"
                    label="If blood-derived DNA is not available, will saliva-derived DNA be acceptable?"
                    {...form.getInputProps(
                        'biospecimenForm.clarifications.salivaAcceptable',
                    )}
                >
                    <Radio
                        required
                        value="Yes"
                        label="Yes"
                        disabled={readOnly}
                    />
                    <Radio value="No" label="No" disabled={readOnly} />
                    <Radio value="TBD" label="TBD" disabled={readOnly} />
                </Radio.Group>

                <Radio.Group
                    withAsterisk={!readOnly}
                    required
                    spacing="xl"
                    label="Will participants with depleted blood/saliva/LCL DNA samples requiring DNA extraction be excluded or will extractions be requested?"
                    {...form.getInputProps(
                        'biospecimenForm.clarifications.depletedDNASampleRequest',
                    )}
                >
                    <Radio
                        required
                        value="Exclude Sample(s)"
                        label="Exclude Sample(s)"
                        disabled={readOnly}
                    />
                    <Radio
                        value="Extract at CCFR Site(s)"
                        label="Extract at CCFR Site(s)"
                        disabled={readOnly}
                    />
                    <Radio value="TBD" label="TBD" disabled={readOnly} />
                </Radio.Group>

                <Radio.Group
                    withAsterisk={!readOnly}
                    required
                    spacing="xl"
                    label="Will participants with depleted FFPE tissue DNA be excluded, or will extractions be requested, or will FFPE sections be requested? If FFPE sections will be requested, how many/case?"
                    {...form.getInputProps(
                        'biospecimenForm.clarifications.depletedFFPE',
                    )}
                >
                    <Radio
                        required
                        value="Exclude Sample(s)"
                        label="Exclude Sample(s)"
                        disabled={readOnly}
                    />
                    <Radio
                        value="Extract at CCFR Site(s)"
                        label="Extract at CCFR Site(s)"
                        disabled={readOnly}
                    />
                    <Radio
                        value="Request FFPE"
                        label="Request FFPE"
                        disabled={readOnly}
                    />
                </Radio.Group>

                <Text>
                    If requesting tumor FFPE (slides or DNA), what is the
                    minimum neoplastic cellularity (NC (%)) required in the
                    tumor bed (or in precursor material for DNAextraction) and
                    what is the minimum tumor volume (mm3) needed?
                </Text>
                <Group grow>
                    <TextInput
                        withAsterisk={!readOnly}
                        required
                        label="Minimum NC"
                        {...form.getInputProps(
                            'biospecimenForm.clarifications.neoplasticCellularity.minNC',
                        )}
                        readOnly={readOnly}
                    />
                    <TextInput
                        withAsterisk={!readOnly}
                        required
                        label="Minimum Volume"
                        {...form.getInputProps(
                            'biospecimenForm.clarifications.neoplasticCellularity.minVolume',
                        )}
                        readOnly={readOnly}
                    />
                </Group>
                <Text>
                    If requesting normal FFPE (slides or DNA), what is the
                    minimum normal volume (mm3) needed?
                </Text>

                <TextInput
                    withAsterisk={!readOnly}
                    required
                    label="Minimum Volume"
                    {...form.getInputProps(
                        'biospecimenForm.clarifications.normalVolume',
                    )}
                    readOnly={readOnly}
                />
            </Stack>
        </Box>
    );
}
