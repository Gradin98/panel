import styled from 'styled-components/macro';
import tw from 'twin.macro';
// @ts-ignore
// import config from '../../../../tailwind.config';

const SubNavigation = styled.div`
    ${tw`w-full bg-neutral-700 shadow overflow-x-auto`};
    background-color: #777 !important;
    
    & > div {
        ${tw`flex items-center text-sm mx-auto px-2`};
        max-width: 1200px;
        background-color: #777 !important;
        
        & > a, & > div {
            ${tw`inline-block py-3 px-4 text-neutral-300 no-underline whitespace-no-wrap transition-all duration-150`};
            color: #fff !important;
            padding: 5px 15px;
            margin: 10px;
            
            &:not(:first-of-type) {
                ${tw`ml-2`};
            }
            
            &:active, &:hover {
                color: #fff !important;
                background: rgba(255, 255, 255, 0.2) !important;
                border-radius: 8px !important;
            }
            
            &:active, &:hover, &.active {
                color: #fff !important;
                background: rgba(255, 255, 255, 0.2) !important;
                border-radius: 8px !important;
            }
        }
    }
`;

export default SubNavigation;
