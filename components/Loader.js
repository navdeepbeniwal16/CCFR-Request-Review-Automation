import React from 'react'
import { Center } from '@mantine/core'
import { DotLoader } from 'react-spinners'

const Loader = () => (
    <Center style={{ width: '100vw', height: '100vh' }}>
        <DotLoader />
    </Center>
)

export default Loader