FROM node:lts-alpine

#Create Root password
RUN --mount=type=secret,id=passwd,required . /run/secrets/passwd \
	&& echo root:${PASSWD} | chpasswd

# Delete defautl User to avoid confusion
RUN deluser --remove-home node
RUN addgroup -S node -g 998
RUN adduser -S -G node -u 998 node

#USER_ID and Group_ID should come from external
ARG USER_ID
ARG GROUP_ID

#Create User
RUN addgroup --g $GROUP_ID -S user
RUN adduser -S -G user  -u $USER_ID user

USER user
WORKDIR /usr/src/app

COPY ./app/package*.json ./

RUN npm install

COPY ./app/* .
