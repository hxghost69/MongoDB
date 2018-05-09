# MongoDB
MongoDB学习笔记
www.imooc.com/article/18438 详细文档
1.下载安装包或压缩包
2.添加db存储和日志存储文件夹

3.添加服务、配置环境变量，启动Mongo
进入到安装目录，例如：
C:\Program Files\MongoDB\Server\3.6\bin
配置路径。两种方式：

一种是命令行中添加参数的方式
C:\Program Files\MongoDB\Server\3.6\bin>mongod --dbpath F:\MongoDB\data --logpath F:\MongoDB\logs\mongo.log

一种是在etc文件夹里面添加配置参数
C:\Program Files\MongoDB\Server\3.6\bin>mongod --config f:\MongoDB\etc\mongo.conf

比较方便的做法然后把这个命令弄成一个服务
C:\Program Files\MongoDB\Server\3.6\bin>mongod --config f:\MongoDB\etc\mongo.con
f --install --serviceName "MongoDB"
然后就可以去services.msc里面直接启动服务了。
删除服务命令：
mongod --config c:\MongoDB\etc\mongo.conf --remove

另外每次都要进入到安装目录。可以配置一下环境变量。
配置了之后，直接cmd命令行就可以操作了。
计算机属性-高级系统设置-环境变量-系统变量，path后面加上：
;C:\Program Files\MongoDB\Server\3.6\bin(注意要加上最前面的分号)

MongoDB命令行操作：

注意这个操作不是在mongo里面的。直接在命令行上的。
导入导出：
mongoimport -d db_demo -c users --file /XX/XX/dumall-users
mongoimport -d 数据库名字 -c 表名 --file 要导入的文件夹名字。

1、添加管理员账户

use admin

db.createUser({user:"admin",pwd:"123456",roles:["root"]})
db.createUser({user:"root",pwd:"123456",roles:[{role:"dbOwner",db:"test"}]})

授权认证
db.auth("admin","123456")

----创建集合
db.createCollection("表名字")

----插入文档
db.表名字.insert({key:value})

----更新文档
db.表名字.update({query,updata,{upsert:boolean,multi:boolean,writeConcern:document}})
参数说明：

query : update的查询条件，类似sql update查询内where后面的。
update : update的对象和一些更新的操作符（如$,$inc...）等，也可以理解为sql update查询内set后面的
upsert : 可选，这个参数的意思是，如果不存在update的记录，是否插入objNew,true为插入，默认是false，不插入。
multi : 可选，mongodb 默认是false,只更新找到的第一条记录，如果这个参数为true,就把按条件查出来多条记录全部更新。
writeConcern :可选，抛出异常的级别。

例如：
db.表明.update({'title':'教程'},{$set:{'title':'m教程'}})
这个只能修改一条。如果要修改多条相同的文档。就要设置multi参数为true
db.col.update({'title':'MongoDB 教程'},{$set:{'title':'MongoDB'}},{multi:true})

save()传入的文档替换已有文档。（例如修改地址啥的，就是改很多条。用save方便。）
db.表名.save({ 
"_id":123,"title" : "MongoDB","description" : "MongoDB 是一个 Nosql 数据库",})

-----删除文档
db.表名.remove(query,justone)
例：db.col.remove({'title':'MongoDB 教程'})
删除一条的话。db.col.remove({'title':'MongoDB 教程'}，1)
删除所有数据db.表名.remove({})

remove()方法已经过时，推荐使用deleteOne(),deleteMany()
如删除集合下全部文档：
db.inventory.deleteMany({})

删除 status 等于 A 的全部文档：
db.inventory.deleteMany({ status : "A" })

删除 status 等于 D 的一个文档：
db.inventory.deleteOne( { status: "D" } )

------查找文档
db.表名.find(query,projection)
query ：可选，使用查询操作符指定查询条件
projection ：可选，使用投影操作符指定返回的键。查询时返回文档中所有键值， 只需省略该参数即可（默认省略）。
db.表名.find().pretty()
pretty() 方法以格式化的方式来显示所有文档。

AND条件，逗号隔开。
db.col.find({key1:value1, key2:value2}).pretty()

OR条件。$or
db.col.find(
   {
      $or: [
         {key1: value1}, {key2:value2}
      ]
   }
).pretty()

AND和OR联合使用
where likes>50 AND(by='菜鸟教程' OR title='MongoDB教程')
db.col.find({"likes":{$gt:50},$or[{"by":"菜鸟教程"},{"title":"MongoDB教程"}]}).pretty()


--------条件操作符
(>) 大于 - $gt
(<) 小于 - $lt
(>=) 大于等于 - $gte
(<= ) 小于等于 - $lte

--------limit()和skip()。sort()
limit(number)指定读取记录条数，skip(number)跳过指定数量的数据
sort(1)升序，sort(-1)降序
sort({"age":1})按字段age的升序排列。
skip(), limilt(), sort()三个放在一起执行的时候，执行的顺序是先 sort(), 然后是 skip()，最后是显示的 limit()。
