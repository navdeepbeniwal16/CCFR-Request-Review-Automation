import { Box, Stack, Textarea } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { Application } from "../../lib/interfaces";

export function Section3a({ form }: { form: UseFormReturnType<Application> }) {
    return (
        <Box>
            <h2>Section 3A: Description of Proposed Collaborative Study</h2>

            <Stack spacing="md">
                <Textarea
                    withAsterisk
                    label="Project Title"
                    autosize
                    {...form.getInputProps('title')}
                />
                <Textarea
                    label="Abstract"
                    autosize
                    minRows={2}
                    {...form.getInputProps('studyDescription.abstract')}
                />
                <Textarea
                    label="Specific Aims"
                    autosize
                    minRows={2}
                    {...form.getInputProps('studyDescription.aims')}
                />
                <Textarea
                    label="Background and Significance of the Proposed Collaborative Study"
                    autosize
                    minRows={2}
                    {...form.getInputProps(
                        'studyDescription.backgroundAndSignificance',
                    )}
                />
                <Textarea
                    label="Preliminary Data"
                    autosize
                    minRows={2}
                    {...form.getInputProps('studyDescription.preliminaryData')}
                />
                <Textarea
                    label="Selection Criteria"
                    autosize
                    minRows={2}
                    {...form.getInputProps(
                        'studyDescription.selectionCriteria',
                    )}
                />
            </Stack>
        </Box>
    );
}