IF OBJECT_ID('dbo.FI_SP_ConsBeneficiario', 'P') IS NOT NULL
    DROP PROCEDURE dbo.FI_SP_ConsBeneficiario;
GO
CREATE PROCEDURE dbo.FI_SP_ConsBeneficiario
    @Id BIGINT
AS
SET NOCOUNT ON;

SELECT Id, Nome, CPF, IdCliente
FROM dbo.Beneficiarios
WHERE (@Id = 0 OR Id = @Id);
GO

IF OBJECT_ID('dbo.FI_SP_IncBeneficiarioV2', 'P') IS NOT NULL
    DROP PROCEDURE dbo.FI_SP_IncBeneficiarioV2;
GO
CREATE PROCEDURE dbo.FI_SP_IncBeneficiarioV2
    @Nome NVARCHAR(200),
    @CPF NVARCHAR(50),
    @IdCliente BIGINT
AS
SET NOCOUNT ON;

INSERT INTO dbo.Beneficiarios (Nome, CPF, IdCliente)
VALUES (@Nome, @CPF, @IdCliente);

SELECT CAST(SCOPE_IDENTITY() AS BIGINT) AS Id;
GO

IF OBJECT_ID('dbo.FI_SP_AltBeneficiario', 'P') IS NOT NULL
    DROP PROCEDURE dbo.FI_SP_AltBeneficiario;
GO
CREATE PROCEDURE dbo.FI_SP_AltBeneficiario
    @Nome NVARCHAR(200),
    @CPF NVARCHAR(50),
    @IdCliente BIGINT,
    @ID BIGINT
AS
SET NOCOUNT ON;

UPDATE dbo.Beneficiarios
SET Nome = @Nome,
    CPF = @CPF,
    IdCliente = @IdCliente
WHERE Id = @ID;
GO

IF OBJECT_ID('dbo.FI_SP_DelBeneficiario', 'P') IS NOT NULL
    DROP PROCEDURE dbo.FI_SP_DelBeneficiario;
GO
CREATE PROCEDURE dbo.FI_SP_DelBeneficiario
    @Id BIGINT
AS
SET NOCOUNT ON;

DELETE FROM dbo.Beneficiarios
WHERE Id = @Id;
GO

IF OBJECT_ID('dbo.FI_SP_PesqBeneficiario', 'P') IS NOT NULL
    DROP PROCEDURE dbo.FI_SP_PesqBeneficiario;
GO
CREATE PROCEDURE dbo.FI_SP_PesqBeneficiario
    @iniciarEm INT,
    @quantidade INT,
    @campoOrdenacao NVARCHAR(100),
    @crescente BIT
AS
SET NOCOUNT ON;

DECLARE @order NVARCHAR(100) = CASE WHEN @campoOrdenacao IS NULL OR LTRIM(RTRIM(@campoOrdenacao)) = '' THEN 'Id' ELSE @campoOrdenacao END;
DECLARE @sql NVARCHAR(MAX);

SET @sql = N'SELECT Id, Nome, CPF, IdCliente FROM dbo.Beneficiarios
ORDER BY ' + QUOTENAME(@order) + CASE WHEN @crescente = 1 THEN ' ASC' ELSE ' DESC' END + 
' OFFSET @iniciarEm ROWS FETCH NEXT @quantidade ROWS ONLY;';

EXEC sp_executesql @sql, N'@iniciarEm INT,@quantidade INT', @iniciarEm=@iniciarEm, @quantidade=@quantidade;

-- segunda resultset com a quantidade total (seguindo mesma lógica usada para clientes)
SELECT COUNT(1) AS Total FROM dbo.Beneficiarios;
GO

IF OBJECT_ID('dbo.FI_SP_VerificaBeneficiario', 'P') IS NOT NULL
    DROP PROCEDURE dbo.FI_SP_VerificaBeneficiario;
GO
CREATE PROCEDURE dbo.FI_SP_VerificaBeneficiario
    @CPF NVARCHAR(50)
AS
SET NOCOUNT ON;

SELECT TOP 1 Id FROM dbo.Beneficiarios WHERE CPF = @CPF;
GO