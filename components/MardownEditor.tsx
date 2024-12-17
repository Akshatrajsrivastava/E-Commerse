import React, { useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Bold, Italic, Heading, Link, Quote, Code, List, ListOrdered, Image, Undo, Redo } from 'lucide-react';

interface ToolbarButtonProps {
    icon: React.ReactNode;
    onClick: () => void;
    title: string;
    active?: boolean;
}

const ToolbarButton = ({ icon, onClick, title, active }: ToolbarButtonProps) => (
    <button
        type="button"
        onClick={onClick}
        className={`p-2 rounded hover:bg-gray-200 transition-colors ${active ? 'bg-gray-200' : 'bg-white'
            }`}
        title={title}
    >
        {icon}
    </button>
);

const MarkdownToolbar = ({
    onAction,
    textareaRef
}: {
    onAction: (type: string, defaultText?: string) => void;
    textareaRef: React.RefObject<HTMLTextAreaElement>;
}) => {
    const [history, setHistory] = useState<string[]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);

    const handleUndo = () => {
        if (historyIndex > 0) {
            setHistoryIndex(historyIndex - 1);
            const previousState = history[historyIndex - 1];
            if (textareaRef.current) {
                textareaRef.current.value = previousState;
                textareaRef.current.dispatchEvent(new Event('input', { bubbles: true }));
            }
        }
    };

    const handleRedo = () => {
        if (historyIndex < history.length - 1) {
            setHistoryIndex(historyIndex + 1);
            const nextState = history[historyIndex + 1];
            if (textareaRef.current) {
                textareaRef.current.value = nextState;
                textareaRef.current.dispatchEvent(new Event('input', { bubbles: true }));
            }
        }
    };

    const toolbarItems = [
        { icon: <Bold size={18} />, action: 'bold', title: 'Bold (Ctrl+B)' },
        { icon: <Italic size={18} />, action: 'italic', title: 'Italic (Ctrl+I)' },
        { icon: <Heading size={18} />, action: 'heading', title: 'Heading' },
        { icon: <Link size={18} />, action: 'link', title: 'Link (Ctrl+K)' },
        { icon: <Quote size={18} />, action: 'quote', title: 'Quote' },
        { icon: <Code size={18} />, action: 'code', title: 'Code' },
        { icon: <List size={18} />, action: 'bullet-list', title: 'Bullet List' },
        { icon: <ListOrdered size={18} />, action: 'number-list', title: 'Numbered List' },
        { icon: <Image size={18} />, action: 'image', title: 'Image' },
    ];

    return (
        <div className="flex flex-wrap gap-1 p-2 bg-gray-50 border-b rounded-t">
            <div className="flex gap-1 items-center">
                {toolbarItems.map((item, index) => (
                    <ToolbarButton
                        key={index}
                        icon={item.icon}
                        onClick={() => onAction(item.action)}
                        title={item.title}
                    />
                ))}
            </div>
            <div className="flex gap-1 items-center ml-auto">
                <ToolbarButton
                    icon={<Undo size={18} />}
                    onClick={handleUndo}
                    title="Undo (Ctrl+Z)"
                />
                <ToolbarButton
                    icon={<Redo size={18} />}
                    onClick={handleRedo}
                    title="Redo (Ctrl+Y)"
                />
            </div>
        </div>
    );
};

const MarkdownEditor = ({ value, onChange }: {
    value: string;
    onChange: (value: string) => void;
}) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [selectedTab, setSelectedTab] = useState('write');

    const handleKeyboardShortcuts = (e: React.KeyboardEvent) => {
        if (e.ctrlKey || e.metaKey) {
            switch (e.key.toLowerCase()) {
                case 'b':
                    e.preventDefault();
                    insertMarkdown('**', '**');
                    break;
                case 'i':
                    e.preventDefault();
                    insertMarkdown('*', '*');
                    break;
                case 'k':
                    e.preventDefault();
                    insertMarkdown('[', '](url)');
                    break;
                case 'z':
                    e.preventDefault();
                    // Handle undo
                    break;
                case 'y':
                    e.preventDefault();
                    // Handle redo
                    break;
            }
        }
    };

    const insertMarkdown = (prefix: string, suffix: string = '', defaultText: string = '') => {
        if (!textareaRef.current) return;

        const textarea = textareaRef.current;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = textarea.value.substring(start, end) || defaultText;

        const newValue =
            textarea.value.substring(0, start) +
            prefix +
            selectedText +
            suffix +
            textarea.value.substring(end);

        onChange(newValue);

        // Set cursor position after insertion
        setTimeout(() => {
            textarea.focus();
            const newPosition = start + prefix.length + selectedText.length;
            textarea.setSelectionRange(newPosition, newPosition);
        }, 0);
    };

    const handleToolbarAction = (type: string) => {
        switch (type) {
            case 'bold':
                insertMarkdown('**', '**', 'strong text');
                break;
            case 'italic':
                insertMarkdown('*', '*', 'emphasized text');
                break;
            case 'heading':
                insertMarkdown('### ', '', 'Heading');
                break;
            case 'link':
                insertMarkdown('[', '](url)', 'link text');
                break;
            case 'quote':
                insertMarkdown('> ', '', 'quote');
                break;
            case 'code':
                insertMarkdown('```\n', '\n```', 'code');
                break;
            case 'bullet-list':
                insertMarkdown('- ', '', 'list item');
                break;
            case 'number-list':
                insertMarkdown('1. ', '', 'list item');
                break;
            case 'image':
                insertMarkdown('![', '](image-url)', 'image alt text');
                break;
        }
    };

    return (
        <div className="border rounded-lg shadow-sm">
            <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
                <div className="flex items-center justify-between border-b bg-gray-50 px-2">
                    <TabsList className="bg-transparent border-none">
                        <TabsTrigger
                            value="write"
                            className={`px-4 py-2 ${selectedTab === 'write' ? 'border-b-2 border-blue-500' : ''
                                }`}
                        >
                            Write
                        </TabsTrigger>
                        <TabsTrigger
                            value="preview"
                            className={`px-4 py-2 ${selectedTab === 'preview' ? 'border-b-2 border-blue-500' : ''
                                }`}
                        >
                            Preview
                        </TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="write" className="focus-within:outline-none">
                    <MarkdownToolbar onAction={handleToolbarAction} textareaRef={textareaRef} />
                    <textarea
                        ref={textareaRef}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        onKeyDown={handleKeyboardShortcuts}
                        className="w-full px-4 py-3 min-h-[300px] font-mono text-base leading-relaxed resize-y focus:outline-none"
                        placeholder="Write your description in markdown..."
                    />
                </TabsContent>

                <TabsContent
                    value="preview"
                    className="px-4 py-3 min-h-[300px] prose prose-sm sm:prose lg:prose-lg max-w-none"
                >
                    {value ? (
                        <ReactMarkdown
                            components={{
                                h1: ({ node, ...props }) => <h1 className="text-2xl font-bold mb-4" {...props} />,
                                h2: ({ node, ...props }) => <h2 className="text-xl font-bold mb-3" {...props} />,
                                h3: ({ node, ...props }) => <h3 className="text-lg font-bold mb-2" {...props} />,
                                p: ({ node, ...props }) => <p className="mb-4" {...props} />,
                                ul: ({ node, ...props }) => <ul className="list-disc pl-6 mb-4" {...props} />,
                                ol: ({ node, ...props }) => <ol className="list-decimal pl-6 mb-4" {...props} />,
                                li: ({ node, ...props }) => <li className="mb-1" {...props} />,
                                blockquote: ({ node, ...props }) => (
                                    <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4" {...props} />
                                ),
                                code: ({ node, ...props }) => (
                                    <code className="bg-gray-100 rounded px-1 py-0.5" {...props} />
                                ),
                                pre: ({ node, ...props }) => (
                                    <pre className="bg-gray-100 rounded p-4 overflow-x-auto my-4" {...props} />
                                ),
                            }}
                        >
                            {value}
                        </ReactMarkdown>
                    ) : (
                        <p className="text-gray-400 italic">Nothing to preview</p>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default MarkdownEditor;