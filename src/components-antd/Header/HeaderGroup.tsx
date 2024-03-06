import { Space } from 'antd';
import type { ReactNode } from 'react';
import './HeaderGroup.css';

interface IProps {
  label?: string;
  extra?: ReactNode;
  children?: ReactNode;
}

const HeaderGroup = (props: IProps) => {
  const { label, extra, children } = props;
  return (
    <Space className='header-group'>
        <div className='content'>
            <div className='label'>{label}</div>
            <div>{children}</div>
        </div>
        <div>{extra}</div>
    </Space>
  );
};

export default HeaderGroup;

