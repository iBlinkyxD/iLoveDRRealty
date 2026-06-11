import { useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Bold, Italic, List, ListOrdered } from 'lucide-react'

interface Props {
  value: string
  onChange: (html: string) => void
  tone: string
}

const EMPTY_HTML = '<p></p>'

export function RichTextEditor({ value, onChange, tone }: Props) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value || EMPTY_HTML,
    onUpdate({ editor }) {
      const html = editor.getHTML()
      onChange(html === EMPTY_HTML ? '' : html)
    },
  })

  // Sync external value changes (e.g. form reset)
  useEffect(() => {
    if (!editor) return
    const current = editor.getHTML()
    const next = value || EMPTY_HTML
    if (current !== next) {
      editor.commands.setContent(next)
    }
  }, [value, editor])

  if (!editor) return null

  const tbtn = (active: boolean) => ({
    background: active ? `${tone}1a` : 'transparent',
    color: active ? tone : '#64748b',
    border: 'none',
    cursor: 'pointer' as const,
    borderRadius: '5px',
    padding: '3px 6px',
    fontWeight: active ? 700 : 500,
    display: 'flex',
    alignItems: 'center' as const,
    gap: '2px',
    lineHeight: 1,
  })

  return (
    <div
      className="rounded-lg border border-line overflow-hidden bg-white transition-colors focus-within:border-brand"
    >
      {/* Toolbar */}
      <div className="flex items-center gap-0.5 px-2 py-1.5 border-b border-line bg-[#f8f9fc]">
        <button
          type="button"
          onMouseDown={e => { e.preventDefault(); editor.chain().focus().toggleBold().run() }}
          style={tbtn(editor.isActive('bold'))}
          title="Bold"
        >
          <Bold size={13} />
        </button>
        <button
          type="button"
          onMouseDown={e => { e.preventDefault(); editor.chain().focus().toggleItalic().run() }}
          style={tbtn(editor.isActive('italic'))}
          title="Italic"
        >
          <Italic size={13} />
        </button>

        <div className="w-px h-4 bg-line mx-1 shrink-0" />

        <button
          type="button"
          onMouseDown={e => { e.preventDefault(); editor.chain().focus().toggleHeading({ level: 2 }).run() }}
          style={{ ...tbtn(editor.isActive('heading', { level: 2 })), fontSize: '11px', fontWeight: editor.isActive('heading', { level: 2 }) ? 800 : 600 }}
          title="Heading 2"
        >
          H2
        </button>
        <button
          type="button"
          onMouseDown={e => { e.preventDefault(); editor.chain().focus().toggleHeading({ level: 3 }).run() }}
          style={{ ...tbtn(editor.isActive('heading', { level: 3 })), fontSize: '11px', fontWeight: editor.isActive('heading', { level: 3 }) ? 800 : 600 }}
          title="Heading 3"
        >
          H3
        </button>

        <div className="w-px h-4 bg-line mx-1 shrink-0" />

        <button
          type="button"
          onMouseDown={e => { e.preventDefault(); editor.chain().focus().toggleBulletList().run() }}
          style={tbtn(editor.isActive('bulletList'))}
          title="Bullet list"
        >
          <List size={13} />
        </button>
        <button
          type="button"
          onMouseDown={e => { e.preventDefault(); editor.chain().focus().toggleOrderedList().run() }}
          style={tbtn(editor.isActive('orderedList'))}
          title="Ordered list"
        >
          <ListOrdered size={13} />
        </button>
      </div>

      {/* Editor */}
      <EditorContent
        editor={editor}
        className={[
          'px-3 py-2.5 text-[13.5px] text-ink min-h-27.5 cursor-text',
          // scope all tiptap content styles
          '[&_.tiptap]:outline-none',
          '[&_.tiptap_p]:my-1 [&_.tiptap_p]:leading-[1.55]',
          '[&_.tiptap_h2]:text-[15px] [&_.tiptap_h2]:font-bold [&_.tiptap_h2]:text-ink [&_.tiptap_h2]:mt-3 [&_.tiptap_h2]:mb-1',
          '[&_.tiptap_h3]:text-[13.5px] [&_.tiptap_h3]:font-semibold [&_.tiptap_h3]:text-ink [&_.tiptap_h3]:mt-2 [&_.tiptap_h3]:mb-0.5',
          '[&_.tiptap_ul]:list-disc [&_.tiptap_ul]:pl-5 [&_.tiptap_ul]:my-1',
          '[&_.tiptap_ol]:list-decimal [&_.tiptap_ol]:pl-5 [&_.tiptap_ol]:my-1',
          '[&_.tiptap_li]:my-0.5 [&_.tiptap_li]:leading-normal',
          '[&_.tiptap_strong]:font-bold',
          '[&_.tiptap_em]:italic',
        ].join(' ')}
      />
    </div>
  )
}
