import { Select, Space } from 'antd';
import type { CSSProperties } from 'react';

interface IProps {
    prefix?: string;
    placeholder?: string;
    style?: CSSProperties;
    options?: { label: string; value: string | number }[];
    value?: string | string[];
    onChange?: (value: string) => void;
    rest?: any;
}

const FilterSelect = (props: IProps) => {
    const { prefix, placeholder, style, options, value, onChange, ...rest } = props;

    return (
        <Space>
            <span>{prefix}</span>
            <Select
                placeholder={placeholder ?? `请选择${prefix ?? ''}`}
                style={{ width: '336px', ...style }}
                options={options}
                // value={value}
                onChange={onChange}
                allowClear
                showSearch
                {...rest}
            />
        </Space>
    );
};

export default FilterSelect;
