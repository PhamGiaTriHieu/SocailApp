import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
import {IIconCustomProps} from '@/interfaces/icon-custom';

const ArrowLeft = (props: IIconCustomProps) => {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={props.size}
      height={props.size}
      color="#000000"
      fill="none"
      {...props}
    >
      <Path
        d="M15 6C15 6 9.00001 10.4189 9 12C8.99999 13.5812 15 18 15 18"
        stroke="currentColor"
        strokeWidth={props.strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default ArrowLeft;