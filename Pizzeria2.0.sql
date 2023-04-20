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
