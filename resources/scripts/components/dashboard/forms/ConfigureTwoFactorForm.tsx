import React, { useState } from 'react';
import { useStoreState } from 'easy-peasy';
import { ApplicationStore } from '@/state';
import SetupTwoFactorModal from '@/components/dashboard/forms/SetupTwoFactorModal';
import DisableTwoFactorModal from '@/components/dashboard/forms/DisableTwoFactorModal';
import tw from 'twin.macro';
import Button from '@/components/elements/Button';

export default () => {
    const user = useStoreState((state: ApplicationStore) => state.user.data!);
    const [ visible, setVisible ] = useState(false);

    return user.useTotp ?
        <div>
            {visible &&
            <DisableTwoFactorModal
                appear
                visible={visible}
                onDismissed={() => setVisible(false)}
            />
            }
            <p css={tw`text-sm`} className={'twofa-color-text'}>
                Opțiunea de Two-Factor Authentification este activată.
            </p>
            <div css={tw`mt-6`} className={'login-button-container'}>
                <Button
                    color={'red'}
                    className={'button-red'}
                    isSecondary
                    onClick={() => setVisible(true)}
                >
                    DISABLE
                </Button>
            </div>
        </div>
        :
        <div>
            {visible &&
            <SetupTwoFactorModal
                appear
                visible={visible}
                onDismissed={() => setVisible(false)}
            />
            }
            <p css={tw`text-sm`} className={'twofa-color-text'}>
                Nu ai activat two-factor authentification pe contul tău. Apasă pe butonul de mai jos pentru a începe configurarea.
            </p>
            <div css={tw`mt-6`} className={'login-button-container'}>
                <Button
                    color={'green'}
                    className={'button-grey'}
                    isSecondary
                    onClick={() => setVisible(true)}
                >
                    ÎNCEPE
                </Button>
            </div>
        </div>
    ;
};
