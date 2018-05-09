cp -a * /var/www/html/gp/
cd /var/www/html/gp/
sed -i 's/localhost/192.168.10.150/g' *.html