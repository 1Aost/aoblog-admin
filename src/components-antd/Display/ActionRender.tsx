import { Button, ButtonProps, Popconfirm, Space, Tooltip } from "antd";
import { type ReactNode } from "react";
interface Iprops {
    onEdit?: (e?) => void;
    editProps?: {title?: string; tooltip?: string} & ButtonProps;
    onDelete?: (e?) => void;
    deleteProps?: {tooltip?: string} & ButtonProps;
    extra?: ReactNode;
    buttons?: ({ title: string; tooltip?: string } & ButtonProps)[];
}
const ActionRender = (props: Iprops) => {
    const { onEdit, editProps, onDelete, deleteProps, extra, buttons = [] } = props;
    const buttonStyle = { padding: 0 };
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
            {buttons?.length > 0 &&
                buttons?.map((btn, index) => (
                <Tooltip key={index} title={btn?.tooltip}>
                    <Button disabled={btn?.disabled} style={buttonStyle} type="text" onClick={btn.onClick}>
                    {btn?.title}
                    </Button>
                </Tooltip>
            ))}

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