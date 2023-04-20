CREATE DATABASE DB_ACCESO
USE DB_ACCESO

create table USUARIO(
	IdUsuario int primary key identity(1,1),
	Correo varchar(100),
	Clave varchar(500),
	Salt varchar(100)
)

----------Procedimiento almacenados para el Login-----------
create proc sp_RegistrarUsuario(
@Correo varchar(100),
@Clave varchar(500),
@Salt varchar(100),
@Registrado bit output,
@Mensaje varchar(100) output
)
as 
begin

	if(not exists(select * from USUARIO where Correo = @Correo))
	begin
		insert into USUARIO(Correo,Clave,Salt) values(@Correo,@Clave,@Salt)
		set @Registrado = 1
		set @Mensaje = 'usuario registrado'
	end
	else
	begin
		set @Registrado = 0
		set @Mensaje = 'Correo ya existe'
	end

end


create proc sp_ValidarUsuario(
@Correo varchar(100),
@Clave varchar(500)
)
as
begin
	if(exists(select * from USUARIO where Correo = @Correo and Clave = @Clave))
		select IdUsuario from USUARIO where Correo = @Correo and Clave = @Clave
	else
		select '0'
end

-----------------Ejecutando Procedimientos--------------

declare @registrado bit, @mensaje varchar(100)

exec sp_RegistrarUsuario 'Kevin@gmail.com','8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', @registrado output, @mensaje output

select @registrado
select @mensaje


select * from USUARIO

exec sp_ValidarUsuario 'Kevin@gmail.com','8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92'