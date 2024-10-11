import {StyleSheet} from 'react-native';
import React from 'react';
import HomeIcon from '@/assets/icons/HomeIcon';
import {SvgProps} from 'react-native-svg';
import {theme} from '@/constants/theme';
import Mail from '@/assets/icons/Mail';
import Lock from '@/assets/icons/Lock';
import ArrowLeft from '@/assets/icons/ArrowLeft';
import Call from '@/assets/icons/Call';
import Camera from '@/assets/icons/Camera';
import Delete from '@/assets/icons/Delete';
import Edit from '@/assets/icons/Edit';
import Heart from '@/assets/icons/Heart';
import Plus from '@/assets/icons/Plus';
import Search from '@/assets/icons/Search';
import Send from '@/assets/icons/Send';
import User from '@/assets/icons/User';
import Video from '@/assets/icons/Video';
import Location from '@/assets/icons/Location';
import Comment from '@/assets/icons/Comment';
import ShareIcon from '@/assets/icons/Share';
import ImageIcon from '@/assets/icons/Image';
import ThreeDotsCircle from '@/assets/icons/ThreeDotsCircle';
import ThreeDotsHorizontal from '@/assets/icons/ThreeDotsHorizontal';
import Logout from '@/assets/icons/Logout';

type IconName = keyof typeof icons;
interface IIconProps extends SvgProps {
  name: IconName;
  size?: number;
  strokeWidth?: number;
  color?: string;
}

const icons = {
  homeIcon: HomeIcon,
  mailIcon: Mail,
  lockIcon: Lock,
  userIcon: User,
  heartIcon: Heart,
  plusIcon: Plus,
  searchIcon: Search,
  locationIcon: Location,
  callIcon: Call,
  cameraIcon: Camera,
  editIcon: Edit,
  arrowLeftIcon: ArrowLeft,
  threeDotsCircleIcon: ThreeDotsCircle,
  threeDotsHorizontalIcon: ThreeDotsHorizontal,
  commentIcon: Comment,
  shareIcon: ShareIcon,
  sendIcon: Send,
  deleteIcon: Delete,
  logoutIcon: Logout,
  imageIcon: ImageIcon,
  videoIcon: Video,
};

const Icon = ({name, size, strokeWidth, color, ...rest}: IIconProps) => {
  const IconComponent = icons[name];
  return (
    <IconComponent
      height={size || 24}
      width={size || 24}
      strokeWidth={strokeWidth || 1.9}
      color={color ?? theme.colors.textLight}
      {...rest}
    />
  );
};

export default Icon;

const styles = StyleSheet.create({});
