import styled from 'styled-components/macro';
import tw from 'twin.macro';

export default styled.div<{ $hoverable?: boolean }>`
    ${tw`flex rounded no-underline text-neutral-200 items-center bg-neutral-700 p-4 border border-transparent transition-colors duration-150 overflow-hidden`};
    background: #fff;
    box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.14), 0 1px 4px 0 rgba(0, 0, 0, 0.12), 0 2px 4px -1px rgba(0, 0, 0, 0.3) !important;
    border-radius: 20px;
    margin-bottom: 20px;
    border: none !important;

    &:hover {
        border: none !important;
    }

    & > div {
        color: #000;

        & > div {
            color: #000;


            & > span {
                color: #000;
            }

            & > p {
                color: #000;
            }

            & > label {
                color: #000;
            }

            & > code {
                color: #000;
                background: #777 !important;
            }

            & > textarea {
                background: #fff !important;
                color: #000;
                border-radius: 20px;
                border: 2px solid #c4c4c4;
            }

            & > div {
                & > span {
                    color: #000;
                }
    
                & > p {
                    color: #000;
                }
                
            }

            & > button {

                & > svg {
                    color: #000 !important;
                }
            }
        }

        & > svg {
            color: #000;
        }

        & > p {
            color: #000;
        }
    }
    
    ${props => props.$hoverable !== false && tw`hover:border-neutral-500`};

    & .icon {
        ${tw`rounded-full bg-neutral-500 p-3`};
        color: #000;
    }
`;
