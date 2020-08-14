#!/bin/bash
#Date:nginx-1.12.1.tar.gz nginx-1.12.1.tar.gz 9:13 2017-9-18
#Author:nginx-1.12.1.tar.gz Create By Lingyuwang
#Mail:nginx-1.12.1.tar.gz nginx-1.12.1.tar.gz lingyuwang@ly-sky.com
#Function:nginx-1.12.1.tar.gz start nginx
#Version:nginx-1.12.1.tar.gz 1.0

###############################
#########CAS 激活状态配置##########
###############################
casEnable=false

if   [ $Cas_Enable ]; 
then 
    casEnable=$Cas_Enable 
fi

echo "casEnable=$casEnable"

sed -i 's/_casStatus/'"$casEnable"'/g' /usr/share/nginx/html/index.html

###############################
#########CAS 登出地址配置##########
###############################
casLogoutUrl=""

if   [ $Cas_LogoutURL ]; 
then 
    casLogoutUrl=$Cas_LogoutURL 
fi

echo "casLogoutUrl=$casLogoutUrl"

sed -i 's|_casLogoutUrl|'"$casLogoutUrl"'|g' /usr/share/nginx/html/index.html

###############################
#########安全中心常见问题地址配置##########
###############################
safePassWord=""

if   [ $Safe_PassWord ]; 
then 
    safePassWord=$Safe_PassWord
fi

echo "safePassWord=$safePassWord"

sed -i 's|_safePassWord|'"$safePassWord"'|g' /usr/share/nginx/html/index.html

###############################
#########安全中心忘记密码地址配置##########
###############################
safeQuestion=""

if   [ $Safe_Question ]; 
then 
    safeQuestion=$Safe_Question
fi

echo "safeQuestion=$safeQuestion"

sed -i 's|_safeQuestion|'"$safeQuestion"'|g' /usr/share/nginx/html/index.html

###############################
#########配置管理后台地址###########
###############################
consoleURL = ""

if   [ $ConsoleURL ];
then 
    consoleURL=$ConsoleURL
fi

echo "consoleURL=$ConsoleURL"

sed -i 's/_consoleUrl/'"$consoleURL"'/g' /usr/share/nginx/html/index.html

###############################
#########配置文档库访问地址（废弃，直接采用nginx转发解决）###########
###############################
#docURL = ""

#if   [ $docURL ];
#then 
#    docURL=$docURL
#fi

#echo "docURL=$docURL"

#sed -i 's/_docUrl/'"$docURL"'/g' usr/share/nginx/html/index.html


###############################
#########卡片的JS URL（废弃，直接采用nginx转发解决）##########
###############################
#cardJS = ""

#if   [ $cardJS ];
#then
#    docURL=$cardJS
#fi

#echo "cardJS=$cardJS"

#sed -i 's/_cardJS/'"$cardJS"'/g' usr/share/nginx/html/index.html


nginx -g  "daemon off;"