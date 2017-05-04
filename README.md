# Banned Drugs
## Open project to track the Banned drugs/medicine all over the world.
### Sample project to use node-ibm_db API


#USER API Details (/user/):

1.  [/druglist](#druglist)
2.  [/search/:drugname](#searchdrug)
3.  [/createdb](#createdb)
4.  [/addbanneddrug](#addbanneddrug)
5.  [/deletedb](#deletedb)


### <a name="druglist"></a> 1) /druglist

Get the list of Banned Drugs.
How : Get - URL/user/druglist


### <a name="searchdrug"></a> 2) /search/:drugname

Search for the particular Banned Drug.
How : Get - URL/user/search/<drug_name>


### <a name="createdb"></a> 3) /createdb

Create database "drug".
How : Post - URL/user/createdb


### <a name="addbanneddrug"></a> 4) /addbanneddrug

Insert the new Banned Drug into Database (1 drug once)
How : Post - URL/user/addbanneddrug
In Body of Post object send : { drugid : value , drugname : value }


### <a name="deletedb"></a> 5) /deletedb

Delete database "drug".
How : Post - URL/user/deletedb