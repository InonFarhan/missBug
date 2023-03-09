export default {
    props: ['user'],
    template: `
            <article className="bug-preview">
                  <h4>{{user.fullname}}</h4>
                  <h4>User name: {{user.username}}</h4>
                  <hr/>
            </article>`,
}