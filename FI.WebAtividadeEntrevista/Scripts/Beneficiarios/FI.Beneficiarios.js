
$(document).ready(function () {
    console.log('beneficiarios pronto');
    $('#formCadastroBen').submit(function (e) {
        console.log('comecou inclusao');
        e.preventDefault();
        $.ajax({
            url: urlBeneficiarioInclusao,
            method: "POST",
            data: {
                "NOME": $(this).find("#NomeBen").val(),
                "CPF": $(this).find("#CpfBen").val(),
                "IDCLIENTE": (obj ? obj.Id : 0)
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
                    ModalDialog("Sucesso!", r)
                    $("#formCadastroBen")[0].reset();
                }
        });
    })
})

function salvarBeneficiario(e) {
    console.log('comecou inclusao');
    e.preventDefault();
    $.ajax({
        url: urlBeneficiarioInclusao,
        method: "POST",
        data: {
            "NOME": $("#NomeBen").val(),
            "CPF": $("#CpfBen").val(),
            "IDCLIENTE": (obj ? obj.Id : 0)
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
                ModalDialog("Sucesso!", r)
                $("#formCadastroBen")[0].reset();
                inicializarGridBeneficiarios();
            }
    });
}

function ModalDialog(titulo, texto) {
    var random = Math.random().toString().replace('.', '');
    var texto = '<div id="' + random + '" class="modal fade">                                                               ' +
        '        <div class="modal-dialog">                                                                                 ' +
        '            <div class="modal-content">                                                                            ' +
        '                <div class="modal-header">                                                                         ' +
        '                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>         ' +
        '                    <h4 class="modal-title">' + titulo + '</h4>                                                    ' +
        '                </div>                                                                                             ' +
        '                <div class="modal-body">                                                                           ' +
        '                    <p>' + texto + '</p>                                                                           ' +
        '                </div>                                                                                             ' +
        '                <div class="modal-footer">                                                                         ' +
        '                    <button type="button" class="btn btn-default" data-dismiss="modal">Fechar</button>             ' +
        '                                                                                                                   ' +
        '                </div>                                                                                             ' +
        '            </div><!-- /.modal-content -->                                                                         ' +
        '  </div><!-- /.modal-dialog -->                                                                                    ' +
        '</div> <!-- /.modal -->                                                                                        ';

    $('body').append(texto);
    $('#' + random).modal('show');
}
