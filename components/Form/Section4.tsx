import { Box, Checkbox, Space, Stack, Text } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { Application } from "../../lib/interfaces";

export function Section4({ form }: { form: UseFormReturnType<Application> }) {
    return (
        <Box>
            <h2>Section 4: Agreement</h2>

            <Stack align="flex-start">
                <Checkbox
                    label="I agree to form a collaboration with the Colon CFR (CCFR). I agree to assume all risks and responsibilities in connection with the receipt, handling, storage and
                    use of data/biomaterials. I agree that the data/biomaterials to be provided by the NCI CCFR will be used only for the purposes specified in the approved proposal.
                    I will provide documentation of IRB/ethics committee review that will include my IRB file number and IRB review date. I agree not to distribute data or biomaterials
                    to third parties without the approval of the CCFR Principal Investigators and then only with fully executed data-use agreement and/or material transfer agreement."
                />
                <Checkbox
                    label="I agree to make study-generated results available to the scientific community by transferring them to the central CCFR Informatics Center within 6 months of their
                    publication and to submit progress reports upon request (at most annually) until the project is completed."
                />
                <Checkbox
                    label=" agree to adhere to the CCFR Policy on Publications and notify the CCFR of planned publications that make use of CCFR data and/or biospecimens and to:
                    1) Register publications with the CCFR early in the planning process;
                    2) Submit publications to the CFR for administrative review prior to submission to a journal; and,
                    3) Acknowledge the contributions (financial and otherwise) of the NCI and CCFR. The CCFR Policy on Publications, Manuscript Registration Form and Review
                    Checklist can be downloaded at www.coloncfr.org/publications."
                />
                <Checkbox
                    label="I understand that the Colon CFR has been funded entirely by the NCI of the U.S. NIH, and that all applicable publications arising from the use of Colon CFR resources
                    must comply with the NIH Public Access Policy by ensuring they are submitted to the PubMed Central (PMC) upon acceptance for publication
                    (see: https://www.nlm.nih.gov/bsd/public_access/resources.html)."
                />
                <Space h="xl" />
                <Text size="sm">
                    <Text weight={700}>
                        [Recommended funding acknowledgement]
                    </Text>
                    &quot;Research reported in this publication was supported in part by the National Cancer Institute (NCI) of the National
                    Institutes of Health (NIH) under award number U01 CA167551. The content of this manuscript does not necessarily reflect
                    the views or policies of the NIH or any of the collaborating centers in the Colon Cancer Family Registry (CCFR), nor does
                    mention of trade names, commercial products, or organizations imply endorsement by the US Government or the
                    CCFR.&quot; [Additional funding acknowledgement for the manuscripts utilizing CCFR GWAS data can be found in our
                    Policy for Publications www.coloncfr.org/publications.]
                </Text>
                <Text size="sm">
                    This document formalizes the agreement between the applicant and site(s) to collaborate.
                </Text>
            </Stack>
            <Space h="xl" />
        </Box>
    );
}