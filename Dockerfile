#基础镜像
FROM registry.ly-sky.com:5000/library/nginx:latest

#作者
LABEL maintainer="zengxiangkai@ly-sky.com"

#工作目录
WORKDIR /usr/share/nginx

ADD ly-sm-mobile-ui.tar.gz /usr/share/nginx/html/

#替换原有的nginx.conf文件
ADD nginx.conf /etc/nginx/nginx.conf

#添加启动脚本到容器中
ADD run.sh /opt/run.sh

#赋予脚本可执行权限
RUN chmod u+x /opt/run.sh

#暴露端口
EXPOSE 80

#连接时执行的命令
CMD ["/bin/bash"]

#启动时执行的命令
ENTRYPOINT /opt/run.sh
