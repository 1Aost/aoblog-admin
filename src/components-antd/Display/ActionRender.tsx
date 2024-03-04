import { Button, ButtonProps, Popconfirm, Space, Tooltip } from "antd";
import { type ReactNode } from "react";
interface Iprops {
    onEdit?: (e?) => void;
    editProps?: {title?: string; tooltip?: string} & ButtonProps;
    onDelete?: (e?) => void;
    deleteProps?: {tooltip?: string} & ButtonProps;
    extra?: ReactNode;
}
const ActionRender = (props: Iprops) => {
    const { onEdit, editProps, onDelete, deleteProps, extra } = props;
    return (
        <Space>
            {onEdit && (
                <Tooltip title={editProps?.tooltip}>
                    <Button
                        type="link"
                        onClick={() => {
                            onEdit?.();
                        }}
                        style={{padding: 0}}
                        {...editProps}
                    >
                        {editProps?.title ?? '编辑'}
                    </Button>
                </Tooltip>
            )}
            {onDelete && (
                <Popconfirm
                    title={`是否确认${deleteProps?.title ?? '删除'}?`}
                    onConfirm={() => {
                        onDelete?.();
                    }}
                >
                    <Tooltip title={deleteProps?.tooltip}>
                        <Button type='link' style={{padding: 0}} danger>
                            {deleteProps?.title ?? '删除'}
                        </Button>
                    </Tooltip>
                </Popconfirm>
            )}
            {extra}
        </Space>
    )
}
export default ActionRender;