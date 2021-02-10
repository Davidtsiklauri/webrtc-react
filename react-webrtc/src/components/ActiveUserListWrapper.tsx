import React, { useEffect, useState } from 'react';
import 'antd/dist/antd.css';
import { Table, Tag, Space } from 'antd';
import { SocketHelper } from '../helper';
import { EVENT } from '../models/socket.interface';
import { IActiveUsers, TagEnum } from '../models/activeUsers.interface';

interface IProps {
  socket: SocketHelper;
}

const columns = [
  {
    title: 'IP ADDRESS',
    dataIndex: 'address',
    key: 'address',
    render: (text: any) => <a>{text}</a>,
  },
  {
    title: 'USER ID',
    dataIndex: 'id',
  },
  {
    title: 'Tags',
    key: 'tag',
    dataIndex: 'tag',
    render: (tag: keyof typeof TagEnum) => (
      <>
        <Tag color={'geekblue'}>{TagEnum[tag]}</Tag>
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
export const ActiveUserListWrapper = ({ socket }: IProps) => {
  const [activeUserList, setColumns] = useState<IActiveUsers[]>([]);

  useEffect(() => {
    socket.messageListener<EVENT>((data: IActiveUsers[]) => {
      setColumns(data);
    }, 'active_users');

    socket.messageListener<EVENT>(({ new_user }: { new_user: IActiveUsers }) => {
      setColumns((activeUsers: IActiveUsers[]) => {
        return [...activeUsers, new_user];
      });
    }, 'new_user');

    socket.messageListener<EVENT>(({ disconnect_user_id }: { disconnect_user_id: string }) => {
      setColumns((activeUsers: IActiveUsers[]) => {
        console.log(activeUsers, disconnect_user_id);
        return activeUsers.filter((users) => users.id !== disconnect_user_id);
      });
    }, 'disconnect_user_id');
  }, [socket]);

  return <Table columns={columns} dataSource={activeUserList} pagination={false} rowKey="id" />;
};
