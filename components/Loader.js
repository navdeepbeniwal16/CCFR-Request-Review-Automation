import React from 'react'
import { Center, useMantineTheme } from '@mantine/core'
import { DotLoader } from 'react-spinners'

const Loader = () => {
    const theme = useMantineTheme();
    return (
        <Center style={{ width: '100vw', height: '100vh' }}>
            <DotLoader color={theme.fn.primaryColor()} />
        </Center>
    )
}

export default Loader