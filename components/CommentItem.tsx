import {Alert, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {heightPercentage} from '@/helpers/commom';
import {theme} from '@/constants/theme';
import Avatar from '@/components/Avatar';
import {getCreateAt} from '@/constants/common';
import Icon from '@/assets/icons';
import {IComment} from '@/interfaces/commom';

interface ICommentItemProps {
  item: IComment;
  highLight?: boolean;
  canDelete?: boolean;
  onDelete?: (item: IComment) => {};
}

const CommentItem = ({
  item,
  canDelete = false,
  onDelete,
  highLight = false,
}: ICommentItemProps) => {
  const handleDelete = () => {
    Alert.alert('Confirm', 'Are you sure you want to delete this?', [
      {
        text: 'Cancel',
        onPress: () => console.log('modal cancel'),
        style: 'cancel',
      },
      {
        text: 'Delete',
        onPress: () => onDelete!(item),
        style: 'destructive',
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Avatar uri={item?.user?.image} />
      <View style={[styles.content, highLight && styles.highlight]}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignContent: 'center',
          }}
        >
          <View style={styles.nameContainer}>
            <Text style={styles.text}>{item?.user?.name}</Text>
            <Text>•</Text>
            <Text style={[styles.text, {color: theme.colors.textLight}]}>
              {getCreateAt(item?.created_at as string)}
            </Text>
          </View>
          {canDelete && (
            <TouchableOpacity onPress={handleDelete}>
              <Icon name="deleteIcon" size={20} color={theme.colors.rose} />
            </TouchableOpacity>
          )}
        </View>
        <Text style={[styles.text, {fontWeight: 'normal'}]}>{item?.text}</Text>
      </View>
    </View>
  );
};

export default CommentItem;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    gap: 7,
  },
  content: {
    backgroundColor: 'rgba(0, 0, 0, 0.06)',
    flex: 1,
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: theme.radius.md,
    borderCurve: 'continuous',
  },
  highlight: {
    borderWidth: 0.2,
    backgroundColor: 'white',
    borderColor: theme.colors.dark,
    shadowColor: theme.colors.dark,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
    gap: 3,
  },
  text: {
    fontSize: heightPercentage(1.6),
    fontWeight: theme.fonts.medium,
    color: theme.colors.textDark,
  },
});
