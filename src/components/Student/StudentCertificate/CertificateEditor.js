import React, { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { Box, Button } from '@chakra-ui/react';
import { PageHeader } from '@/common/PageHeader';
import { useRouter } from 'next/router';

export const CertificateEditor = () => {
    const router = useRouter()
    
    const editorRef = useRef(null);

    const getCertificateHTML = () => {
        if (editorRef.current) {
            const content = editorRef.current.getContent();
        }
    };

    return (
        <Box h={"100%"}>
            <PageHeader heading={"Certificate Template"} />
            <Box p={5} bg={"white"} h={"90%"}>
                <Box className="scrollBar" maxH={"100%"} overflowY={"scroll"}>
                    <Editor
                        apiKey='ttlyt4gw6eh90rtnmkm24gfixo3g9bhcyn7zesuxyrzytucw'
                        onInit={(evt, editor) => (editorRef.current = editor)}
                        init={{
                            plugins: [
                                'anchor', 'autolink', 'charmap', 'codesample', 'emoticons', 'image', 'link', 'lists', 'searchreplace', 'visualblocks', 'wordcount',
                                'checklist', 'mediaembed', 'casechange', 'export', 'formatpainter', 'pageembed', 'a11ychecker', 'tinymcespellchecker', 'permanentpen',
                                'powerpaste', 'advtable', 'advcode', 'editimage', 'advtemplate', 'ai', 'mentions', 'tinycomments', 'tableofcontents', 'footnotes',
                                'mergetags', 'autocorrect', 'typography', 'inlinecss', 'markdown'
                            ],
                            toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image mergetags | align lineheight | spellcheckdialog a11ycheck typography | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
                            tinycomments_mode: 'embedded',
                            tinycomments_author: 'Author name',
                            mergetags_list: [
                                {
                                    title: 'Student',
                                    menu: [
                                        {
                                            value: 'student.name',
                                            title: 'Student Name'
                                        },
                                        {
                                            value: 'student.name',
                                            title: 'SR No.'
                                        },
                                        {
                                            value: 'student.address',
                                            title: 'Address'
                                        },
                                        {
                                            value: 'student.class',
                                            title: 'Class'
                                        },
                                        {
                                            value: 'student.stream',
                                            title: 'Stream'
                                        },
                                        {
                                            value: 'student.section',
                                            title: 'Section'
                                        },
                                    ]
                                },
                                {
                                    title: 'Father',
                                    menu: [
                                        {
                                            value: 'father.name',
                                            title: 'Father Name'
                                        },
                                        {
                                            value: 'father.contact',
                                            title: 'Father Contact'
                                        },
                                    ]
                                }
                            ],
                            ai_request: (request, respondWith) => respondWith.string(() => Promise.reject('See docs to implement AI Assistant')),
                        }}
                        initialValue="Welcome to Certificate Editor"
                    />
                    <Button onClick={getCertificateHTML}>Save</Button>
                </Box>
            </Box>
        </Box>
    );
};
