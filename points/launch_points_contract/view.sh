addr='0xe4ca4b1a52adce45fe6ba790dc2b4c581a23123d8dff9e21f9c40ab75a3a256b'
sender='rooch1un9ykxjj4h8ytlnt57gdc26vtqdzxy3a3hleug0ecs9twk36y44sfukefl'
set pwd = ''
echo '################################\n'
rooch move publish --password ${pwd}

echo '################################\n'
rooch move run  --password  ${pwd} --function ${addr}::earn_points::say_hello --sender  ${sender}

echo '################################\n'
rooch resource --address ${addr} --resource ${addr}::earn_points::HelloMessage

echo '################################\n'
rooch resource --address ${addr} --resource ${addr}::earn_points::FarmingAsset

echo '################################\n'
rooch move run  --password  ${pwd} --function ${addr}::earn_points::update_coin_icon --sender  ${sender}

echo '################################\n'