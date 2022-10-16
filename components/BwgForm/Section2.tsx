import { Box, Textarea } from '@mantine/core'
import { UseFormReturnType } from '@mantine/form'
import React from 'react'
import { Application } from '../../lib/interfaces'

export function Section2({ form }:{
    form: UseFormReturnType<Application>
}){
    return (
        <Box>
            <h2>{'Section 2: Methodology & Testing'}</h2>

            <Textarea
                required
                label="Proposed Testing and Methodology"
                {...form.getInputProps('biospecimenForm.proposedTestingMethodlogy')}
            />
        </Box>
    )
}