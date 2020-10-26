import React, { useState } from 'react';
import { RouteComponentProps } from 'react-router';
import { parse } from 'query-string';
import { Link } from 'react-router-dom';
import performPasswordReset from '@/api/auth/performPasswordReset';
import { httpErrorToHuman } from '@/api/http';
import LoginFormContainer from '@/components/auth/LoginFormContainer';
import { Actions, useStoreActions } from 'easy-peasy';
import { ApplicationStore } from '@/state';
import { Formik, FormikHelpers } from 'formik';
import { object, ref, string } from 'yup';
import Field from '@/components/elements/Field';
import Input from '@/components/elements/Input';
import tw from 'twin.macro';
import Button from '@/components/elements/Button';

interface Values {
    password: string;
    passwordConfirmation: string;
}

export default ({ match, location }: RouteComponentProps<{ token: string }>) => {
    const [ email, setEmail ] = useState('');

    const { clearFlashes, addFlash } = useStoreActions((actions: Actions<ApplicationStore>) => actions.flashes);

    const parsed = parse(location.search);
    if (email.length === 0 && parsed.email) {
        setEmail(parsed.email as string);
    }

    const submit = ({ password, passwordConfirmation }: Values, { setSubmitting }: FormikHelpers<Values>) => {
        clearFlashes();
        performPasswordReset(email, { token: match.params.token, password, passwordConfirmation })
            .then(() => {
                // @ts-ignore
                window.location = '/';
            })
            .catch(error => {
                console.error(error);

                setSubmitting(false);
                addFlash({ type: 'error', title: 'Error', message: httpErrorToHuman(error) });
            });
    };

    return (
        <Formik
            onSubmit={submit}
            initialValues={{
                password: '',
                passwordConfirmation: '',
            }}
            validationSchema={object().shape({
                password: string().required('Adaugă o nouă parolă.')
                    .min(8, 'Parola trebuie să fie minim 8 caractere.'),
                passwordConfirmation: string()
                    .required('Parolele nu se potrivesc.')
                    // @ts-ignore
                    .oneOf([ ref('password'), null ], 'Parolele nu se potrivesc.'),
            })}
        >
            {({ isSubmitting }) => (
                <LoginFormContainer
                    title={'RESETARE PAROLĂ'}
                    css={tw`w-full flex`}
                    className={'login-container'}
                >
                    <div className={'form-login-design'}>
                        <label>Email</label>
                        <Input value={email} isLight disabled/>
                    </div>
                    <div css={tw`mt-6`} className={'form-login-design'}>
                        <Field
                            light
                            label={'Parolă nouă'}
                            name={'password'}
                            type={'password'}
                            description={'Parola trebuie să fie minim 8 caractere.'}
                        />
                    </div>
                    <div css={tw`mt-6`} className={'form-login-design'}>
                        <Field
                            light
                            label={'Confirmare parolă nouă'}
                            name={'passwordConfirmation'}
                            type={'password'}
                        />
                    </div>
                    <div css={tw`mt-6`} className={'login-button-container'}>
                        <Button
                            size={'xlarge'}
                            type={'submit'}
                            disabled={isSubmitting}
                            isLoading={isSubmitting}
                            className={'button-login'}
                        >
                            Reset
                        </Button>
                    </div>
                    <div css={tw`mt-6 text-center`} className={'text-forgot-password'}>
                        <Link
                            to={'/auth/login'}
                            className={'forgot-password'}
                            css={tw`text-xs text-neutral-500 tracking-wide no-underline uppercase hover:text-neutral-600`}
                        >
                            Înapoi la Login
                        </Link>
                        <p>Contul se crează automat numai la achiziționarea produselor de pe site-ul <b>fun-network.ro</b></p>
                    </div>
                </LoginFormContainer>
            )}
        </Formik>
    );
};
