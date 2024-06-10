import React, { useCallback, useEffect, useState } from 'react';
import { cx } from 'remirror';
import {
  MentionExtension,
  MentionExtensionAttributes,
  PlaceholderExtension,
} from 'remirror/extensions';
import {
  FloatingWrapper,
  Remirror,
  ThemeProvider,
  useMention,
  useRemirror,
} from '@remirror/react';

function UserSuggestor({
  allUsers,
}: {
  allUsers: MentionExtensionAttributes[];
}): JSX.Element {
  const [users, setUsers] = useState<MentionExtensionAttributes[]>([]);
  const { state, getMenuProps, getItemProps, indexIsHovered, indexIsSelected } =
    useMention({
      items: users,

      onExit: (props, command) => {
        console.log(props);
        console.log(command);
        //command();
      },
    });

  useEffect(() => {
    if (!state) {
      return;
    }

    const searchTerm = state.query.full.toLowerCase();
    const filteredUsers = allUsers
      .filter((user) => user.label.toLowerCase().includes(searchTerm))
      .sort()
      .slice(0, 5);
    setUsers(filteredUsers);
  }, [state, allUsers]);

  const enabled = !!state;

  return (
    <FloatingWrapper
      positioner="cursor"
      enabled={enabled}
      placement="bottom-start"
    >
      <div {...getMenuProps()} className="suggestions" onKeyDown={console.log}>
        {enabled &&
          users.map((user, index) => {
            const isHighlighted = indexIsSelected(index);
            const isHovered = indexIsHovered(index);

            return (
              <div
                key={user.id}
                className={cx(
                  'suggestion',
                  isHighlighted && 'highlighted',
                  isHovered && 'hovered'
                )}
                {...getItemProps({
                  item: user,
                  index,
                })}
              >
                {user.label}
              </div>
            );
          })}
      </div>
    </FloatingWrapper>
  );
}

const Basic = (): JSX.Element => {
  const me = new MentionExtension({
    //extraAttributes: { type: 'user' },
    matchers: [{ name: 'at', char: '@', appendText: ' ', matchOffset: 0 }],
  });
  me.addHandler('onChange', console.log);
  const extensions = useCallback(
    () => [me, new PlaceholderExtension({ placeholder: `Mention a @user` })],
    []
  );

  const { manager } = useRemirror({ extensions });

  const allUsers = [
    { id: 'joe', label: 'Joe <div>ciao</div>' },
    { id: 'sue', label: 'Sue' },
    { id: 'pat', label: 'Pat' },
    { id: 'tom', label: 'Tom' },
    { id: 'jim', label: 'Jim' },
  ];

  console.log(allUsers);

  return (
    <ThemeProvider>
      <Remirror manager={manager} autoRender="end">
        <UserSuggestor allUsers={allUsers} />
      </Remirror>
    </ThemeProvider>
  );
};

export default Basic;
