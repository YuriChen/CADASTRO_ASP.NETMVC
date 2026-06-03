function inicializarGridBeneficiarios()
{
    console.log('document.getElementById("gridBeneficiarios"):' + document.getElementById("gridBeneficiarios"));
    if (document.getElementById("gridBeneficiarios"))
        $('#gridBeneficiarios').jtable({
            paging: true, //Enable paging
            pageSize: 5, //Set page size (default: 10)
            sorting: false, //Enable sorting
            defaultSorting: 'Nome ASC', //Set default sorting
            actions: {
                listAction: urlBeneficiarioList,
            },
            fields: {
                CPF: {
                    title: 'CPF',
                    width: '35%'
                },
                Nome: {
                    title: 'Nome',
                    width: '50%'
                },

                Alterar: {
                    title: '',
                    display: function (data) {
                        return '<button onclick="window.location.href=\'' + urlBeneficiarioAlteracao + '/' + data.record.Id + '\'" class="btn btn-primary btn-sm">Alterar</button>';
                    }
                },

                Deletar: {
                    title: '',
                    display: function (data) {
                        return '<button onclick=\'deletarBeneficiario(event, ' + data.record.Id + ')\' class="btn btn-primary btn-sm">Deletar</button>';
                    }
                }
            }
        });

    //Load student list from server
    if (document.getElementById("gridBeneficiarios"))
        $('#gridBeneficiarios').jtable('load');
}

function deletarBeneficiario(e, id) {
    console.log('comecou exclusao');
    e.preventDefault();
    $.ajax({
        url: urlBeneficiarioExclusao,
        method: "POST",
        data: {
            "ID": id
        },
        error:
            function (r) {
                if (r.status == 400)
                    ModalDialog("Ocorreu um erro", r.responseJSON);
                else if (r.status == 500)
                    ModalDialog("Ocorreu um erro", "Ocorreu um erro interno no servidor.");
            },
        success:
            function (r) {
                ModalDialog("Beneficiário excluído com sucesso.", r)
                $("#formCadastroBen")[0].reset();
                inicializarGridBeneficiarios();
            }
    });
}