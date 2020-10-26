import React from 'react';
import { Actions, State, useStoreActions, useStoreState } from 'easy-peasy';
import { Form, Formik, FormikHelpers } from 'formik';
import Field from '@/components/elements/Field';
import * as Yup from 'yup';
import SpinnerOverlay from '@/components/elements/SpinnerOverlay';
import updateAccountPassword from '@/api/account/updateAccountPassword';
import { httpErrorToHuman } from '@/api/http';
import { ApplicationStore } from '@/state';
import tw from 'twin.macro';
import Button from '@/components/elements/Button';

interface Values {
    current: string;
    password: string;
    confirmPassword: string;
}

const schema = Yup.object().shape({
    current: Yup.string().min(1).required('You must provide your current password.'),
    password: Yup.string().min(8).required(),
    confirmPassword: Yup.string().test('password', 'Password confirmation does not match the password you entered.', function (value) {
        return value === this.parent.password;
    }),
});

export default () => {
    const user = useStoreState((state: State<ApplicationStore>) => state.user.data);
    const { clearFlashes, addFlash } = useStoreActions((actions: Actions<ApplicationStore>) => actions.flashes);

    if (!user) {
        return null;
    }

    const submit = (values: Values, { setSubmitting }: FormikHelpers<Values>) => {
        clearFlashes('account:password');
        updateAccountPassword({ ...values })
            .then(() => {
                // @ts-ignore
                window.location = '/auth/login';
            })
            .catch(error => addFlash({
                key: 'account:password',
                type: 'error',
                title: 'Error',
                message: httpErrorToHuman(error),
            }))
            .then(() => setSubmitting(false));
    };

    return (
        <React.Fragment>
            <Formik
                onSubmit={submit}
                validationSchema={schema}
                initialValues={{ current: '', password: '', confirmPassword: '' }}
            >
                {
                    ({ isSubmitting, isValid }) => (
                        <React.Fragment>
                            <SpinnerOverlay size={'large'} visible={isSubmitting}/>
                            <Form css={tw`m-0`}>
                                <div className={'form-login-design'}>
                                    <Field
                                        id={'current_password'}
                                        type={'password'}
                                        name={'current'}
                                        label={'Parolă curentă'}
                                    />
                                </div>
                                <div css={tw`mt-6`} className={'form-login-design'}>
                                    <Field
                                        id={'new_password'}
                                        type={'password'}
                                        name={'password'}
                                        label={'Parolă nouă'}
                                        description={'Parola trebuie să fie minim 8 caractere.'}
                                    />
                                </div>
                                <div css={tw`mt-6`} className={'form-login-design'}>
                                    <Field
                                        id={'confirm_password'}
                                        type={'password'}
                                        name={'confirmPassword'}
                                        label={'Confirmare parolă nouă'}
                                    />
                                </div>
                                <div css={tw`mt-6`} className={'login-button-container'}>
                                    <Button size={'small'} disabled={isSubmitting || !isValid} className={'button-login'}>
                                        UPDATE
                                    </Button>
                                </div>
                            </Form>
                        </React.Fragment>
                    )
                }
            </Formik>
        </React.Fragment>
    );
};
