import KeyboardAvoidViewContainer from '@/components/KeyboardAvoidViewContainer';
import {theme} from '@/constants/theme';
import React, {useEffect, useRef} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {actions, RichEditor, RichToolbar} from 'react-native-pell-rich-editor';

interface IRichTextEditorProps {
  editorRef: any;
  editTextValue?: any;
  onChange: (value: string) => void;
}

const RichTextEditor = ({
  editorRef,
  editTextValue,
  onChange,
}: IRichTextEditorProps) => {
  return (
    <KeyboardAvoidViewContainer>
      <View style={{minHeight: 285}}>
        <RichToolbar
          style={styles.richBar}
          flatContainerStyle={styles.flatStyle}
          selectedIconTint={theme.colors.primaryDark}
          editor={editorRef}
          disabled={false}
          actions={[
            actions.setStrikethrough,
            actions.removeFormat,
            actions.setBold,
            actions.setItalic,
            actions.insertOrderedList,
            actions.blockquote,
            actions.alignLeft,
            actions.alignCenter,
            actions.alignRight,
            actions.code,
            actions.line,
            actions.heading1,
            actions.heading4,
          ]}
          iconMap={{
            [actions.heading1]: ({tintColor}: any) => (
              <Text style={{color: tintColor}}>H1</Text>
            ),
            [actions.heading4]: ({tintColor}: any) => (
              <Text style={{color: tintColor}}>H4</Text>
            ),
          }}
        />

        <RichEditor
          ref={editorRef}
          containerStyle={styles.rich}
          editorStyle={{color: theme.colors.textDark, placeholderColor: 'gray'}}
          initialContentHTML={editTextValue}
          placeholder="What's on your mind"
          onChange={onChange}
        />
      </View>
    </KeyboardAvoidViewContainer>
  );
};

export default RichTextEditor;

const styles = StyleSheet.create({
  richBar: {
    borderTopRightRadius: theme.radius.xl,
    borderTopLeftRadius: theme.radius.xl,
    backgroundColor: theme.colors.gray,
  },
  rich: {
    minHeight: 240,
    flex: 1,
    borderWidth: 1.5,
    borderTopWidth: 0,
    borderBottomLeftRadius: theme.radius.xl,
    borderBottomRightRadius: theme.radius.xl,
    borderColor: theme.colors.gray,
    padding: 5,
  },

  flatStyle: {
    paddingHorizontal: 8,
    gap: 3,
  },
});
