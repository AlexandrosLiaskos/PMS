declare module '@/components/magicui/file-tree' {
  interface FileTreeItem {
    id: string;
    name: string;
    children?: FileTreeItem[];
  }

  interface FileTreeProps {
    data: FileTreeItem[];
    onSelect?: (id: string) => void;
    className?: string;
  }

  export function FileTree(props: FileTreeProps): React.ReactElement;
}
