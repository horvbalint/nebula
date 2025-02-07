<script lang="ts" setup>
import Highlight from '@tiptap/extension-highlight'
import Image from '@tiptap/extension-image'
import Table from '@tiptap/extension-table'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import TableRow from '@tiptap/extension-table-row'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import StarterKit from '@tiptap/starter-kit'
import { Editor, EditorContent, type Extensions } from '@tiptap/vue-3'

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

interface ToolConfig {
  icon: string
  name: string
  onClick: () => unknown
  isDisabled?: Ref<boolean>
  isActive?: Ref<boolean>
  isVisible?: Ref<boolean>
}

const editor = ref<null | Editor>(null)
const toolbar: { rows: ToolConfig[][][] } = {
  rows: [
    [
      [
        {
          icon: 'material-symbols:undo-rounded',
          name: 'Visszavonás',
          onClick: () => editor.value!.chain().focus().undo().run(),
          isDisabled: computed(() => !editor.value?.can().undo()),
        },
        {
          icon: 'material-symbols:redo-rounded',
          name: 'Ismétlés',
          onClick: () => editor.value!.chain().focus().redo().run(),
          isDisabled: computed(() => !editor.value?.can().redo()),
        },
      ],
      [
        {
          icon: 'material-symbols:format-bold-rounded',
          name: 'Félkövér',
          onClick: () => editor.value!.chain().focus().toggleBold().run(),
          isActive: computed(() => !!editor.value?.isActive('bold')),
        },
        {
          icon: 'material-symbols:format-italic-rounded',
          name: 'Olaszos',
          onClick: () => editor.value!.chain().focus().toggleItalic().run(),
          isActive: computed(() => !!editor.value?.isActive('italic')),
        },
        {
          icon: 'material-symbols:format-underlined-rounded',
          name: 'Aláhúzott',
          onClick: () => editor.value!.chain().focus().toggleUnderline().run(),
          isActive: computed(() => !!editor.value?.isActive('underline')),
        },
        {
          icon: 'material-symbols:ink-highlighter-outline-rounded',
          name: 'Kiemelt',
          onClick: () => editor.value!.chain().focus().toggleHighlight().run(),
          isActive: computed(() => !!editor.value?.isActive('highlight')),
        },
      ],
      [
        {
          icon: 'material-symbols:format-align-left-rounded',
          name: 'Balra igazított',
          onClick: () => editor.value!.chain().focus().setTextAlign('left').run(),
          isActive: computed(() => !!editor.value?.isActive({ textAlign: 'left' })),
        },
        {
          icon: 'material-symbols:format-align-center-rounded',
          name: 'Középre igazított',
          onClick: () => editor.value!.chain().focus().setTextAlign('center').run(),
          isActive: computed(() => !!editor.value?.isActive({ textAlign: 'center' })),
        },
        {
          icon: 'material-symbols:format-align-right-rounded',
          name: 'Jobbra igazított',
          onClick: () => editor.value!.chain().focus().setTextAlign('right').run(),
          isActive: computed(() => !!editor.value?.isActive({ textAlign: 'right' })),
        },
        {
          icon: 'material-symbols:format-align-justify-rounded',
          name: 'Sorkizárt',
          onClick: () => editor.value!.chain().focus().setTextAlign('justify').run(),
          isActive: computed(() => !!editor.value?.isActive({ textAlign: 'justify' })),
        },
      ],
      [
        {
          icon: 'material-symbols:format-list-bulleted-rounded',
          name: 'Lista',
          onClick: () => editor.value!.chain().focus().toggleBulletList().run(),
          isActive: computed(() => !!editor.value?.isActive('bulletList')),
        },
        {
          icon: 'material-symbols:format-list-numbered-rounded',
          name: 'Sorszámozott lista',
          onClick: () => editor.value!.chain().focus().toggleOrderedList().run(),
          isActive: computed(() => !!editor.value?.isActive('orderedList')),
        },
      ],
      [
        {
          icon: 'material-symbols:horizontal-rule-rounded',
          name: 'Vízszintes vonal',
          onClick: () => editor.value!.chain().focus().setHorizontalRule().run(),
        },
      ],
    ],
    [
      [
        {
          icon: 'material-symbols:format-h1-rounded',
          name: 'Címsor 1',
          onClick: () => editor.value!.chain().focus().toggleHeading({ level: 1 }).run(),
          isActive: computed(() => !!editor.value?.isActive('heading', { level: 1 })),
        },
        {
          icon: 'material-symbols:format-h2-rounded',
          name: 'Címsor 2',
          onClick: () => editor.value!.chain().focus().toggleHeading({ level: 2 }).run(),
          isActive: computed(() => !!editor.value?.isActive('heading', { level: 2 })),
        },
        {
          icon: 'material-symbols:format-h3-rounded',
          name: 'Címsor 3',
          onClick: () => editor.value!.chain().focus().toggleHeading({ level: 3 }).run(),
          isActive: computed(() => !!editor.value?.isActive('heading', { level: 3 })),
        },
        {
          icon: 'material-symbols:format-h4-rounded',
          name: 'Címsor 4',
          onClick: () => editor.value!.chain().focus().toggleHeading({ level: 4 }).run(),
          isActive: computed(() => !!editor.value?.isActive('heading', { level: 4 })),
        },
      ],
      [
        {
          icon: 'material-symbols:table',
          name: 'Táblázat',
          onClick: () => editor.value!.chain().focus().insertTable({ rows: 1, cols: 2, withHeaderRow: false }).run(),
        },
        {
          icon: 'material-symbols:splitscreen-add-outline-rounded',
          name: 'Táblázat sor',
          onClick: () => editor.value!.chain().focus().addRowAfter().run(),
          isDisabled: computed(() => !editor.value?.can().addRowAfter()),
        },
        {
          icon: 'material-symbols:splitscreen-vertical-add-outline-rounded',
          name: 'Táblázat oszlop',
          onClick: () => editor.value!.chain().focus().addColumnAfter().run(),
          isDisabled: computed(() => !editor.value?.can().addColumnAfter()),
        },
        {
          icon: 'fluent:table-delete-column-24-regular',
          name: 'Oszlop törlés',
          onClick: () => editor.value!.chain().focus().deleteColumn().run(),
          isDisabled: computed(() => !editor.value?.can().deleteColumn()),
        },
        {
          icon: 'fluent:table-delete-row-24-regular',
          name: 'Sor törlés',
          onClick: () => editor.value!.chain().focus().deleteRow().run(),
          isDisabled: computed(() => !editor.value?.can().deleteRow()),
        },
        {
          icon: 'material-symbols:cell-merge-rounded',
          name: 'Cella egyesítés',
          onClick: () => editor.value!.chain().focus().mergeCells().run(),
          isVisible: computed(() => !!editor.value?.can().mergeCells()),
        },
        {
          icon: 'ant-design:split-cells-outlined',
          name: 'Cella szétválasztás',
          onClick: () => editor.value!.chain().focus().splitCell().run(),
          isVisible: computed(() => !!editor.value?.can().splitCell()),
        },
      ],
    ],
  ],
}

watch(() => props.modelValue, (value) => {
  if (!editor.value)
    return

  const isSame = editor.value.getHTML() === value
  if (isSame)
    return

  editor.value.commands.setContent(value, false)
})

onMounted(() => {
  // @ts-expect-error these are the same type
  editor.value = new Editor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4],
        },
      }),
      Image,
      Table,
      TableCell,
      TableHeader,
      TableRow,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Underline,
      Highlight,
    ],
    content: props.modelValue,
    onUpdate: () => emit('update:modelValue', editor.value!.getHTML()),
  })
})

onBeforeUnmount(() => {
  editor.value!.destroy()
})
</script>

<template>
  <div class="ath-rich-text-editor">
    <header>
      <div class="toolbar">
        <div v-for="(row, rowIndex) in toolbar.rows" :key="`row-${rowIndex}`" class="toolbar-row">
          <template v-for="(group, groupIndex) in row" :key="`group-${groupIndex}`">
            <div class="toolbar-group">
              <template v-for="tool in group" :key="tool.name">
                <neb-tooltip v-show="!tool.isVisible || tool.isVisible.value" :title="tool.name">
                  <neb-button
                    :type="tool.isActive?.value ? 'tertiary' : 'tertiary-neutral'"
                    :disabled="tool.isDisabled?.value"
                    small
                    @click="tool.onClick()"
                  >
                    <icon :name="tool.icon" />
                  </neb-button>
                </neb-tooltip>
              </template>
            </div>

            <hr>
          </template>
        </div>
      </div>
    </header>
    <!-- @vue-expect-error these are the same types -->
    <EditorContent :editor="editor" class="tip-tap-editor" />
  </div>
</template>

<style scoped>
.ath-rich-text-editor {
  display: flex;
  flex-direction: column;
  border-radius: var(--radius-default);
  background: white;
  min-height: 300px;
  border: 1px solid var(--neutral-color-200);
  transition: all var(--duration-default);

  &:focus-within {
    border-color: var(--primary-color-300);
    box-shadow: var(--primary-focus-shadow-light);
  }
}
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--neutral-color-200);
  padding: var(--space-3);
}
.toolbar {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}
.toolbar-row {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);

  hr {
    border: none;
    width: 2px;
    background: var(--neutral-color-200);

    &:last-child {
      display: none;
    }
  }
}
.toolbar-group {
  display: flex;
  align-items: center;

  .icon {
    width: 20px;
    height: 20px;
  }
}
.tip-tap-editor {
  padding: var(--space-4);
  flex: 1;

  &:deep(.ProseMirror) {
    outline: none;
    height: 100%;
    width: 100%;
  }
}

.dark-mode {
  .ath-rich-text-editor {
    background: var(--neutral-color-950);
    border: 1px solid var(--neutral-color-700);

    &:focus-within {
      border-color: var(--primary-color-700);
      box-shadow: var(--primary-focus-shadow-dark);
    }
  }
  header {
    border-bottom: 1px solid var(--neutral-color-800);
  }
  .toolbar-row {
    hr {
      background: var(--neutral-color-800);
    }
  }
}
</style>
