import { Modal as RNModal, Pressable, Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { i18n } from '@/services/i18n';

interface ModalProps {
  visible: boolean;
  title: string;
  body: string;
  onClose: () => void;
}

export function Modal({ visible, title, body, onClose }: ModalProps) {
  return (
    <RNModal animationType="fade" transparent visible={visible}>
      <View className="flex-1 items-center justify-center bg-black/50 px-6">
        <View className="w-full rounded-md bg-white p-5 dark:bg-zinc-950">
          <Text className="text-xl font-semibold text-ink dark:text-white">{title}</Text>
          <Text className="mt-2 text-base text-zinc-600 dark:text-zinc-300">{body}</Text>
          <View className="mt-5 gap-3">
            <Button label={i18n.t('common.confirm')} onPress={onClose} />
            <Pressable onPress={onClose}>
              <Text className="text-center text-sm font-medium text-zinc-500">
                {i18n.t('common.close')}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </RNModal>
  );
}
