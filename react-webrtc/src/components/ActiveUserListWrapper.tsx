import React from 'react';
import 'antd/dist/antd.css';
import { Table, Tag, Space } from 'antd';

const columns = [
  {
    title: 'IP ADDRESS',
    dataIndex: 'ipAddress',
    key: 'name',
    render: (text: any) => <a>{text}</a>,
  },
  {
    title: 'USER ID',
    dataIndex: 'userId',
    key: 'age',
  },
  {
    title: 'Tags',
    key: 'tags',
    dataIndex: 'tags',
    render: (tags: any) => (
      <>
        {tags.map((tag: any) => {
          let color = tag.length > 5 ? 'geekblue' : 'green';
          if (tag === 'loser') {
            color = 'volcano';
          }
          return (
            <Tag color={color} key={tag}>
              {tag.toUpperCase()}
            </Tag>
          );
        })}
      </>
    ),
  },
  {
    title: 'Action',
    key: 'action',
    render: (text: any, userId: any) => (
      <Space size="middle">
        <a>Call</a>
      </Space>
    ),
  },
];

const data = [
  {
    key: '1',
    ipAddress: 'John Brown',
    userId: 32,
    tags: ['nice', 'developer'],
  },
  {
    key: '2',
    ipAddress: 'Jim Green',
    userId: 42,
    tags: ['loser'],
  },
  {
    key: '3',
    ipAddress: 'Joe Black',
    userId: 32,
    tags: ['cool', 'teacher'],
  },
];
export const ActiveUserListWrapper = () => {
  return <Table columns={columns} dataSource={data} pagination={false} />;
};
