import { Box, Stack, Textarea } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import { Application } from '../../lib/interfaces';

export function Section3a({
    form,
    readOnly,
}: {
    form: UseFormReturnType<Application>;
    readOnly?: boolean;
}) {
    return (
        <Box>
            <h2>Section 3A: Description of Proposed Collaborative Study</h2>

            <Stack spacing="md">
                <Textarea
                    withAsterisk
                    label="Project Title"
                    autosize
                    {...form.getInputProps('title')}
                    readOnly={readOnly}
                />
                <Textarea
                    label="Abstract"
                    autosize
                    minRows={2}
                    {...form.getInputProps('studyDescription.abstract')}
                    readOnly={readOnly}
                />
                <Textarea
                    label="Specific Aims"
                    autosize
                    minRows={2}
                    {...form.getInputProps('studyDescription.aims')}
                    readOnly={readOnly}
                />
                <Textarea
                    label="Background and Significance of the Proposed Collaborative Study"
                    autosize
                    minRows={2}
                    {...form.getInputProps(
                        'studyDescription.backgroundAndSignificance',
                    )}
                    readOnly={readOnly}
                />
                <Textarea
                    label="Preliminary Data"
                    autosize
                    minRows={2}
                    {...form.getInputProps('studyDescription.preliminaryData')}
                    readOnly={readOnly}
                />
                <Textarea
                    label="Selection Criteria"
                    autosize
                    minRows={2}
                    {...form.getInputProps(
                        'studyDescription.selectionCriteria',
                    )}
                    readOnly={readOnly}
                />
            </Stack>
        </Box>
    );
}
