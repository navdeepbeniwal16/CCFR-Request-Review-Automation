import { Box, Textarea } from "@mantine/core"
import { UseFormReturnType } from "@mantine/form"
import { Application } from "../../lib/interfaces"

export function Section4({ form }:{
    form: UseFormReturnType<Application>
}){
    return (
        <Box>
            <h2>{'Section 4: Biospecimen Working Group Review Conclusions'}</h2>
            <Textarea
                required
                label="Biospecimen Working Group Review Conclusions"
                {...form.getInputProps('biospecimenForm.clarifications.BWGGroupConclusions')}
            />
        </Box>
    )
}