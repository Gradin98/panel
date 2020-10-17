import React, { useEffect, useState } from 'react';
import Modal, { RequiredModalProps } from '@/components/elements/Modal';
import { Form, Formik, FormikHelpers } from 'formik';
import { object, string } from 'yup';
import getTwoFactorTokenUrl from '@/api/account/getTwoFactorTokenUrl';
import enableAccountTwoFactor from '@/api/account/enableAccountTwoFactor';
import { Actions, useStoreActions } from 'easy-peasy';
import { ApplicationStore } from '@/state';
import { httpErrorToHuman } from '@/api/http';
import FlashMessageRender from '@/components/FlashMessageRender';
import Field from '@/components/elements/Field';
import tw from 'twin.macro';
import Button from '@/components/elements/Button';

interface Values {
    code: string;
}

export default ({ onDismissed, ...props }: RequiredModalProps) => {
    const [ token, setToken ] = useState('');
    const [ loading, setLoading ] = useState(true);
    const [ recoveryTokens, setRecoveryTokens ] = useState<string[]>([]);

    const updateUserData = useStoreActions((actions: Actions<ApplicationStore>) => actions.user.updateUserData);
    const { addError, clearFlashes } = useStoreActions((actions: Actions<ApplicationStore>) => actions.flashes);

    useEffect(() => {
        clearFlashes('account:two-factor');
        getTwoFactorTokenUrl()
            .then(setToken)
            .catch(error => {
                console.error(error);
                addError({ message: httpErrorToHuman(error), key: 'account:two-factor' });
            });
    }, []);

    const submit = ({ code }: Values, { setSubmitting }: FormikHelpers<Values>) => {
        clearFlashes('account:two-factor');
        enableAccountTwoFactor(code)
            .then(tokens => {
                setRecoveryTokens(tokens);
            })
            .catch(error => {
                console.error(error);

                addError({ message: httpErrorToHuman(error), key: 'account:two-factor' });
            })
            .then(() => setSubmitting(false));
    };

    const dismiss = () => {
        if (recoveryTokens.length > 0) {
            updateUserData({ useTotp: true });
        }

        onDismissed();
    };

    const urlToGoogle = () => {
        document.location.href = 'https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2';
    };

    const urlToApple = () => {
        document.location.href = 'https://apps.apple.com/us/app/google-authenticator/id388497605';
    };

    return (
        <Formik
            onSubmit={submit}
            initialValues={{ code: '' }}
            validationSchema={object().shape({
                code: string()
                    .required('You must provide an authentication code to continue.')
                    .matches(/^(\d){6}$/, 'Authenticator code must be 6 digits.'),
            })}
        >
            {({ isSubmitting }) => (
                <Modal
                    {...props}
                    top={false}
                    onDismissed={dismiss}
                    dismissable={!isSubmitting}
                    showSpinnerOverlay={loading || isSubmitting}
                    closeOnEscape={!recoveryTokens}
                    closeOnBackground={!recoveryTokens}
                >
                    {recoveryTokens.length > 0 ?
                        <>
                            <h2 css={tw`text-2xl mb-4`} className={'twofa-title-text'}>Autentificare 2FA activată</h2>
                            <p css={tw`text-neutral-300`} className={'twofa-text-description-finish'}>
                            Opțiunea de securitate Two-Factor Authentification este activată. Dacă pierdeți accesul la device-ul pe care-l folosiți la autentificare atunci o să aveți nevoie de codurile de mai jos.
                            </p>
                            <p css={tw`text-neutral-300 mt-4`} className={'twofa-text-description-finish twofa-text-margin-top'}>
                                <strong>Aceste coduri nu vor mai fi afișate niciodată.</strong> Te rugăm să le păstrezi într-un loc cât mai sigur, cum ar fi un password manager.
                            </p>
                            <pre css={tw`text-sm mt-4 rounded font-mono bg-neutral-900 p-4`} className={'twofa-list-of-tokens'}>
                                {recoveryTokens.map(token => <code key={token} css={tw`block mb-1`}>{token}</code>)}
                            </pre>
                            <div css={tw`text-right`}>
                                <Button css={tw`mt-6`} onClick={dismiss} className={'button-red'}>
                                    Close
                                </Button>
                            </div>
                        </>
                        :
                        <Form css={tw`mb-0`}>
                            <FlashMessageRender css={tw`mb-6`} byKey={'account:two-factor'}/>
                            <div css={tw`flex flex-wrap`}>
                                <div css={tw`w-full md:flex-1`} className={'twofa-image-container-margin'}>
                                    <div css={tw`w-32 h-32 md:w-64 md:h-64 bg-neutral-600 p-2 rounded mx-auto`} className={'twofa-image-container'}>
                                        {!token || !token.length ?
                                            <img
                                                src={'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='}
                                                css={tw`w-64 h-64 rounded`}
                                            />
                                            :
                                            <img
                                                src={`https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${token}`}
                                                onLoad={() => setLoading(false)}
                                                css={tw`w-full h-full shadow-none rounded-none`}
                                            />
                                        }
                                    </div>
                                </div>
                                <div css={tw`w-full mt-6 md:mt-0 md:flex-1 md:flex md:flex-col`}>
                                    <div className={'instructiuni-twofa'}>
                                        <p>Instrucțiuni</p>
                                        <p>1. Descarcă aplicația Google Authentificator de pe Google Play sau App Store.</p>
                                        <p>2. Scanează codul QR.</p>
                                        <p>3. Introdu codul în căsuța de mai jos.</p>
                                    </div>
                                    <div className={'image-app-stores'}>
                                        <img onClick={urlToGoogle} src={'/assets/svgs/googleplay.svg'} alt='googleplay'/>
                                        <img onClick={urlToApple} src={'/assets/svgs/appstore.svg'} alt='appstore'/>
                                    </div>
                                    <div css={tw`flex-1`} className={'form-twofa-design'}>
                                        <Field
                                            id={'code'}
                                            name={'code'}
                                            type={'text'}
                                            title={'Code From Authenticator'}
                                            label={'Introduceți codul'}
                                            description={'După scanarea imaginii QR, introduceți codul de pe dispozitivul de autentificare ales.'}
                                            autoFocus={!loading}
                                        />
                                    </div>
                                    <div css={tw`mt-6 md:mt-0 text-right`} className={'login-button-container'}>
                                        <Button className={'button-login'} style={ { marginTop: '20px' }}>
                                            Setup
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </Form>
                    }
                </Modal>
            )}
        </Formik>
    );
};
