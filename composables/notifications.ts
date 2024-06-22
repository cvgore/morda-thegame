import {useState} from "#app";
import {useTimeoutFn, watchArray} from "@vueuse/core";

export const useNotifications = () => {
    const idCounter = ref(0);
    const list = useState<{id: number, text: string}[]>('notifications', () => []);

    watchArray(list, (value, oldValue, added, removed, onCleanup) => {
        if (added.length !== 0) {
            setTimeout(() => {
                list.value = list.value.filter(x => x.id !== added[0].id);
            }, 3500);
        }
    }, { deep: true });


    return {
        list,
        showNotification(text: string) {
            list.value.unshift({
                id: idCounter.value++,
                text,
            })
        }
    }
};