import React, { useEffect, useState } from 'react';
import 'antd/dist/antd.css';
import { Table, Tag, Space, Button } from 'antd';
import { SocketHelper } from '../../helper';
import { TagEnum, IActiveUsers } from '../../models/activeUsers.interface';
import { EVENT } from '../../models/socket.interface';
import { PersistentStorage } from '../../shared/classes/persistent.storage';

interface IProps {
  socket: SocketHelper;
  cb: () => any;
}

const storage = new PersistentStorage(localStorage);

const getColumns = async (cb): Promise<any> => {
  const id = await storage.getItem<string>('id');
  return [
    {
      title: 'IP ADDRESS',
      dataIndex: 'address',
      key: 'address',
      render: (text: any) => <span>{text}</span>,
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
      render: (user: IActiveUsers) => callUser(user.id, id, cb),
    },
  ];
};

const callUser = (userId: string, myId: string, cb) => {
  if (userId !== myId) {
    return (
      <div onClick={cb}>
        <Space size="middle">
          <Button type="link">Call</Button>
        </Space>
      </div>
    );
  }
  return;
};

export const ActiveUserListWrapper = ({ socket, cb }: IProps) => {
  const [activeUserList, setUseList] = useState<IActiveUsers[]>([]);
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    (async () => {
      setColumns(await getColumns(cb));
    })();
  }, []);

  useEffect(() => {
    socket.messageListener<EVENT>((data: IActiveUsers[]) => {
      setUseList(data);
    }, 'active_users');

    socket.messageListener<EVENT>(({ new_user }: { new_user: IActiveUsers }) => {
      setUseList((activeUsers: IActiveUsers[]) => {
        return [...activeUsers, new_user];
      });
    }, 'new_user');

    socket.messageListener<EVENT>(({ disconnect_user_id }: { disconnect_user_id: string }) => {
      setUseList((activeUsers: IActiveUsers[]) => {
        return activeUsers.filter((users) => users.id !== disconnect_user_id);
      });
    }, 'disconnect_user_id');
  }, [socket]);

  return <Table columns={columns} dataSource={activeUserList} pagination={false} rowKey="id" />;
};
