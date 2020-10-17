import React, { forwardRef } from 'react';
import { Form } from 'formik';
import styled from 'styled-components/macro';
import { breakpoint } from '@/theme';
// import FlashMessageRender from '@/components/FlashMessageRender';
import tw from 'twin.macro';

type Props = React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement> & {
    title?: string;
}

const Container = styled.div`
    ${breakpoint('sm')`
        ${tw`w-4/5 mx-auto`}
    `};

    ${breakpoint('md')`
        ${tw`p-10`}
    `};

    ${breakpoint('lg')`
        ${tw`w-3/5`}
    `};

    ${breakpoint('xl')`
        ${tw`w-full`}
        max-width: 500px;
    `};
`;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default forwardRef<HTMLFormElement, Props>(({ title, ...props }, ref) => (
    <Container className={'login-container-center'}>
        {/* <FlashMessageRender css={tw`mb-2 px-1`}/> */}
        <Form {...props} ref={ref}>
            <div css={tw`md:flex w-full bg-white shadow-lg rounded-lg p-6 md:pl-0 mx-1`} className={'login-remove-padding'}>
                <div css={tw`flex-1`} className={'login-left-container'}>
                    <img src={'/assets/svgs/logo-gradient.svg'} className={'login-image'}/>
                    <p className={'login-title-left'}>{title}</p>

                    {props.children}
                </div>
            </div>
        </Form>
    </Container>
));
