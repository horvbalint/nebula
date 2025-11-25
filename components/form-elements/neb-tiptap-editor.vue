<script lang="ts" setup>
import Highlight from '@tiptap/extension-highlight'
import Image from '@tiptap/extension-image'
import { Table, TableCell, TableHeader, TableRow } from '@tiptap/extension-table'
import TextAlign from '@tiptap/extension-text-align'
import StarterKit from '@tiptap/starter-kit'
import { Editor, EditorContent } from '@tiptap/vue-3'

const props = defineProps<{
  modelValue: string
  label?: string
  required?: boolean
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

const { t } = useI18n()
const editor = shallowRef<null | Editor>(null)
const toolbar: { rows: ToolConfig[][][] } = {
  rows: [
    [
      [
        {
          icon: 'material-symbols:undo-rounded',
          name: t('tiptap.toolbar.undo'),
          onClick: () => editor.value!.chain().focus().undo().run(),
          isDisabled: computed(() => !editor.value?.can().undo()),
        },
        {
          icon: 'material-symbols:redo-rounded',
          name: t('tiptap.toolbar.redo'),
          onClick: () => editor.value!.chain().focus().redo().run(),
          isDisabled: computed(() => !editor.value?.can().redo()),
        },
      ],
      [
        {
          icon: 'material-symbols:format-bold-rounded',
          name: t('tiptap.toolbar.bold'),
          onClick: () => editor.value!.chain().focus().toggleBold().run(),
          isActive: computed(() => !!editor.value?.isActive('bold')),
        },
        {
          icon: 'material-symbols:format-italic-rounded',
          name: t('tiptap.toolbar.italic'),
          onClick: () => editor.value!.chain().focus().toggleItalic().run(),
          isActive: computed(() => !!editor.value?.isActive('italic')),
        },
        {
          icon: 'material-symbols:link',
          name: t('tiptap.toolbar.link'),
          onClick: () => initLinkModal(),
          isActive: computed(() => !!editor.value?.isActive('link')),
        },
        {
          icon: 'material-symbols:format-underlined-rounded',
          name: t('tiptap.toolbar.underline'),
          onClick: () => editor.value!.chain().focus().toggleUnderline().run(),
          isActive: computed(() => !!editor.value?.isActive('underline')),
        },
        {
          icon: 'material-symbols:ink-highlighter-outline-rounded',
          name: t('tiptap.toolbar.highlight'),
          onClick: () => editor.value!.chain().focus().toggleHighlight().run(),
          isActive: computed(() => !!editor.value?.isActive('highlight')),
        },
      ],
      [
        {
          icon: 'material-symbols:format-align-left-rounded',
          name: t('tiptap.toolbar.align-left'),
          onClick: () => editor.value!.chain().focus().setTextAlign('left').run(),
          isActive: computed(() => !!editor.value?.isActive({ textAlign: 'left' })),
        },
        {
          icon: 'material-symbols:format-align-center-rounded',
          name: t('tiptap.toolbar.align-center'),
          onClick: () => editor.value!.chain().focus().setTextAlign('center').run(),
          isActive: computed(() => !!editor.value?.isActive({ textAlign: 'center' })),
        },
        {
          icon: 'material-symbols:format-align-right-rounded',
          name: t('tiptap.toolbar.align-right'),
          onClick: () => editor.value!.chain().focus().setTextAlign('right').run(),
          isActive: computed(() => !!editor.value?.isActive({ textAlign: 'right' })),
        },
        {
          icon: 'material-symbols:format-align-justify-rounded',
          name: t('tiptap.toolbar.align-justify'),
          onClick: () => editor.value!.chain().focus().setTextAlign('justify').run(),
          isActive: computed(() => !!editor.value?.isActive({ textAlign: 'justify' })),
        },
      ],
      [
        {
          icon: 'material-symbols:format-list-bulleted-rounded',
          name: t('tiptap.toolbar.bullet-list'),
          onClick: () => editor.value!.chain().focus().toggleBulletList().run(),
          isActive: computed(() => !!editor.value?.isActive('bulletList')),
        },
        {
          icon: 'material-symbols:format-list-numbered-rounded',
          name: t('tiptap.toolbar.ordered-list'),
          onClick: () => editor.value!.chain().focus().toggleOrderedList().run(),
          isActive: computed(() => !!editor.value?.isActive('orderedList')),
        },
      ],
      [
        {
          icon: 'material-symbols:horizontal-rule-rounded',
          name: t('tiptap.toolbar.horizontal-rule'),
          onClick: () => editor.value!.chain().focus().setHorizontalRule().run(),
        },
      ],
      [
        {
          icon: 'material-symbols:format-h1-rounded',
          name: t('tiptap.toolbar.heading-1'),
          onClick: () => editor.value!.chain().focus().toggleHeading({ level: 1 }).run(),
          isActive: computed(() => !!editor.value?.isActive('heading', { level: 1 })),
        },
        {
          icon: 'material-symbols:format-h2-rounded',
          name: t('tiptap.toolbar.heading-2'),
          onClick: () => editor.value!.chain().focus().toggleHeading({ level: 2 }).run(),
          isActive: computed(() => !!editor.value?.isActive('heading', { level: 2 })),
        },
        {
          icon: 'material-symbols:format-h3-rounded',
          name: t('tiptap.toolbar.heading-3'),
          onClick: () => editor.value!.chain().focus().toggleHeading({ level: 3 }).run(),
          isActive: computed(() => !!editor.value?.isActive('heading', { level: 3 })),
        },
        {
          icon: 'material-symbols:format-h4-rounded',
          name: t('tiptap.toolbar.heading-4'),
          onClick: () => editor.value!.chain().focus().toggleHeading({ level: 4 }).run(),
          isActive: computed(() => !!editor.value?.isActive('heading', { level: 4 })),
        },
      ],
    ],
  ],
}

watch(() => props.modelValue, (value: string) => {
  if (!editor.value)
    return

  const isSame = editor.value.getHTML() === value
  if (isSame)
    return

  editor.value.commands.setContent(value, {
    emitUpdate: false,
  })
})

onMounted(() => {
  editor.value = new Editor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4],
        },
        link: {
          openOnClick: false,
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
      Highlight,
    ],
    content: props.modelValue,
    onUpdate: () => emit('update:modelValue', editor.value!.getHTML()),
  })
})

const url = ref('')
const showLinkModal = ref(false)

function initLinkModal() {
  if (!editor.value)
    return

  url.value = editor.value.getAttributes('link').href
  showLinkModal.value = true
}
function setLink() {
  if (url.value === null)
    return

  if (url.value === '') {
    unsetLink()
  }
  else {
    editor.value?.chain()
      .focus()
      .extendMarkRange('link')
      .setLink({ href: url.value, target: '_blank' })
      .run()
  }

  showLinkModal.value = false
}
function unsetLink() {
  editor.value?.chain()
    .focus()
    .extendMarkRange('link')
    .unsetLink()
    .run()

  showLinkModal.value = false
}
onBeforeUnmount(() => {
  editor.value!.destroy()
})
</script>

<template>
  <div class="editor-component">
    <span v-if="label">{{ label }} <span v-if="$props.required" class="required-star">*</span></span>

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

      <EditorContent :editor="editor!" class="tip-tap-editor" @click="editor!.commands.focus()" />
    </div>
  </div>

  <neb-modal
    v-model="showLinkModal"
    :title="t('tiptap.link-modal.title')"
    header-icon="material-symbols:link"
    min-width="550px"
  >
    <template #content>
      <neb-input
        v-model="url"
        :required="true"
        :label="t('tiptap.link-modal.url')"
        :placeholder="t('tiptap.link-modal.url-placeholder')"
      />
    </template>

    <template #actions>
      <neb-button type="secondary-neutral" @click="unsetLink()">
        {{ t('tiptap.link-modal.cancel') }}
      </neb-button>

      <neb-button :disabled="!url" @click="setLink()">
        {{ t('tiptap.link-modal.save') }}
      </neb-button>
    </template>
  </neb-modal>
</template>

<style scoped>
.ath-rich-text-editor {
  display: flex;
  flex-direction: column;
  border-radius: var(--radius-default);
  overflow: hidden;
  background: white;
  min-height: 300px;
  border: 1px solid var(--neutral-color-300);
  transition: all var(--duration-default);

  &:focus-within {
    border-color: var(--primary-color-300);
    box-shadow: var(--primary-focus-shadow-light);
  }
}
.editor-component {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  font-size: var(--text-sm);
  font-weight: 500;
  width: 100%;
  color: var(--neutral-color-800);
}
.required-star {
  color: var(--error-color-500);
}
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--neutral-color-200);
  padding: var(--space-3);
  background: var(--neutral-color-50);
}
.toolbar {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}
.toolbar-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-1);

  hr {
    border: none;
    width: 3px;
    height: 20px;
    background: var(--neutral-color-100);

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
