import bcrypt from 'bcrypt';
import { getLogger } from 'logade';
import { avatarURL } from '~/modules/config.server';
import { aql, db } from '~/modules/arango';
import { timeStamp } from '~/modules/utils';
import type { User, UserLogin, UserSystem } from '~/interfaces/User';

const log = getLogger('User');
const hasConnection = db.collection('hasConnection');
const users = db.collection('users');

export async function createUser({ username, email, password }: UserSystem) {
  try {
    const userCheckQ = await db.query(aql`
      FOR u IN ${users}
        FILTER u.username == ${username} OR u.email == ${email}
        RETURN u
    `);
    const userCheck = await userCheckQ.all();

    if (userCheck.length > 0) {
      throw new Error('Username or Email already taken');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password as string, salt);

    const user = await users.save(
      {
        username,
        email,
        password: hashedPassword,
        createdAt: timeStamp(),
        updatedAt: timeStamp()
      },
      {
        returnNew: true
      }
    );

    user.id = user._key;

    return user;
  } catch (err: any) {
    log.error(err.message);
    log.error(err.stack);
    throw err;
  }
}

export async function userLogin({ email, password }: UserLogin) {
  try {
    const query = await db.query(aql`
      FOR doc IN ${users}
        FILTER doc.email == ${email}
        LIMIT 1
        RETURN doc
    `);
    const login = await query.next();

    if (!login) {
      throw new Error('Incorrect Username or Email');
    }
    const verification = await bcrypt.compare(password, login.password);

    if (!verification) {
      throw new Error('Incorrect Password');
    }

    login.id = login._key;

    return login;
  } catch (err: any) {
    log.error(err.message);
    log.error(err.stack);
    throw err;
  }
}

export async function getUserById(id: User['id']) {
  try {
    const query = await db.query(aql`
      FOR doc IN ${users}
        FILTER doc._key == ${id}
        LIMIT 1
        RETURN doc
    `);
    const user = await query.next();

    if (!user) {
      throw new Error('User ID was not Found!');
    }

    user.id = user._key;
    user.isLoggedIn = true;

    return user;
  } catch (err: any) {
    log.error(err.message);
    log.error(err.stack);
    throw err;
  }
}

export async function getUserAccount(id: User['id']) {
  try {
    const query = await db.query(aql`
      FOR doc IN ${users}
        FILTER doc._key == ${id}
        LIMIT 1
        RETURN {
          "username": doc.username,
          "email": doc.email,
          "settings": doc.settings
        }
    `);
    const userData = await query.next();

    if (!userData) {
      throw new Error('User ID was not Found!');
    }

    const account = await userData.next();

    return {
      ...account,
      avatar: {
        sm: `${avatarURL}sm/${account?.avatar}`,
        md: `${avatarURL}md/${account?.avatar}`,
        lg: `${avatarURL}lg/${account?.avatar}`
      }
    };
  } catch (err: any) {
    log.error(err.message);
    log.error(err.stack);
    throw err;
  }
}

export async function getUser({
  id,
  username,
  userId
}: {
  id: string | undefined;
  username: string | undefined;
  userId: string | undefined;
}) {
  try {
    if (id) {
      // Used for administration
      return await users.document(id);
    }
    let connection;
    if (username) {
      // Used for User page
      if (userId) {
        connection = aql`LET connections = (
          FOR connection, edge IN OUTBOUND user ${hasConnection}
            
            OPTIONS {
              bfs: true,
              uniqueVertices: 'global'
            }
            FILTER connection._key == ${userId}
          RETURN { status: edge.status, createdAt: edge.createdAt, updatedAt: edge.updatedAt }
        )`;
      } else {
        connection = aql`LET connections = [{}]`;
      }
      const data = await db.query(
        aql`
          FOR user IN ${users}
            FILTER user.username == ${username}
            LIMIT 1
            ${connection}
            RETURN {
              "id" : user._key,
              "username" : user.username,
              "createdAt" : user.createdAt,
              "updatedAt" : user.updatedAt,
              "connection" : connections[0],
              "avatar" : user.avatar
            }`
      );
      const user = await data.next();

      user.connected = Boolean(user?.connection?.status === 'Active');
      user.avatar = `${avatarURL}md/${user?.avatar}`;

      return user;
    }
  } catch (error: any) {
    log.error(error.message);
    log.error(error.stack);
    throw error;
  }
}

export async function getUsers() {
  try {
    const data = await db.query(
      aql`
    FOR user IN ${users}
      SORT user.username ASC
      RETURN {
        "id" : user._key,
        "username" : user.username,
        "createdAt" : user.createdAt,
        "updatedAt" : user.updatedAt,
        "avatar" : user.avatar
      }`
    );

    return { nodes: await data.all(), storage: avatarURL };
  } catch (error: any) {
    log.error(error.message);
    log.error(error.stack);
    throw error;
  }
}
