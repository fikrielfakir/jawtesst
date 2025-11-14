import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface ReelsIconProps {
  size?: number;
  color?: string;
}

export const ReelsIcon: React.FC<ReelsIconProps> = ({ size = 24, color = '#EFEFEF' }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M20.2009 5.99995L3.00093 11L2.10093 8.59995C1.80093 7.49995 2.40093 6.39995 3.40093 6.09995L16.9009 2.09995C18.0009 1.79995 19.1009 2.39995 19.4009 3.39995L20.2009 5.99995Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M6.20312 5.30005L9.30313 9.20005"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12.3984 3.40002L15.4984 7.40002"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M3 11H21V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V11Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};
